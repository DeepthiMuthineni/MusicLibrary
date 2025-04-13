const express = require('express');
const { 
    registerUser, 
    loginUser, 
    getUserProfile, 
    logoutUser 
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Routes to loggedIn User
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.post('/logout', logoutUser);


module.exports = router;

