const User = require('../models/User');
const jwt = require('jsonwebtoken');

//generate jwt token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Register user 
exports.registerUser = async (req, res) => {
    const { username, password, email, phoneNumber, role } = req.body;
    try {
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        const phoneExists = await User.findOne({ phoneNumber });
        if (phoneExists) {
            return res.status(400).json({ message: 'Phone number already in use' });
        }
        const user = await User.create({ username, password, email, phoneNumber, role });
        res.status(201).json(user)  
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Login user
exports.loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                role: user.role,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// To check the profile of user
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Logout user
exports.logoutUser = async (req, res) => {
    res.status(200).json({ message: 'Logout successful' });
};


