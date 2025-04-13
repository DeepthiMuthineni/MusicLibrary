const Song = require('../models/Songs');

// Get all songs (Admins see all and Users see only visible songs)
exports.getAllSongs = async (req, res) => {
    try {
        let query = {}; 
        if (req.user && req.user.role !== 'admin') {
            query.visibility = true; 
        }
        const songs = await Song.find(query);
        if (songs.length === 0) return res.status(404).json({ message: 'No songs found' });
        res.status(200).json(songs);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get a song by ID (Admins see all and Users see only visible songs)
exports.getSongById = async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);
        if (!song) return res.status(404).json({ message: 'Song not found' });
        if (req.user && req.user.role !== 'admin' && !song.visibility) {
            return res.status(403).json({ message: 'You are not authorized to view this song' });
        }
        res.status(200).json(song);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get songs by name (Admins see all and Users see only visible songs)
exports.getSongsByName = async (req, res) => {
    try {
        const regex = new RegExp(req.params.name, 'i');
        let query = { name: { $regex: regex } };
        if (req.user && req.user.role !== 'admin') {
            query.visibility = true; 
        }
        const songs = await Song.find(query);
        if (songs.length === 0) {
            return res.status(404).json({ message: 'No songs found with this name' });
        }
        res.status(200).json(songs);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get songs by album (Admins see all and Users see only visible songs)
exports.getSongsByAlbum = async (req, res) => {
    try {
        const regex = new RegExp(req.params.album, 'i');
        let query = { album: { $regex: regex } };
        if (req.user && req.user.role !== 'admin') {
            query.visibility = true; 
        }
        const songs = await Song.find(query);
        if (songs.length === 0) {
            return res.status(404).json({ message: 'No songs found for this album' });
        }
        res.status(200).json(songs);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get songs by music director (Admins see all and Users see only visible songs)
exports.getSongsByMusicDirector = async (req, res) => {
    try {
        const regex = new RegExp(req.params.musicDirector, 'i');
        let query = { musicDirector: { $regex: regex } };
        if (req.user && req.user.role !== 'admin') {
            query.visibility = true; 
        }
        const songs = await Song.find(query);
        if (songs.length === 0) {
            return res.status(404).json({ message: 'No songs found by this music director' });
        }
        res.status(200).json(songs);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get songs by singer (Admins see all and Users see only visible songs)
exports.getSongsBySinger = async (req, res) => {
    try {
        const regex = new RegExp(req.params.singer, 'i');
        let query = { singer: { $regex: regex } };
        if (req.user && req.user.role !== 'admin') {
            query.visibility = true;
        }
        const songs = await Song.find(query);
        if (songs.length === 0) {
            return res.status(404).json({ message: 'No songs found by this singer' });
        }
        res.status(200).json(songs);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create a new song (Admin only)
exports.createSong = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admins only' });
        }
        const song = new Song({
            ...req.body,
             creatorId: req.user._id 
        });
        
        await song.save();
        res.status(201).json({ message: 'Song created', song });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update an existing song (Admin only)
exports.updateSong = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admins only' });
        }
        const song = await Song.findById(req.params.id);
        if (!song) return res.status(404).json({ message: 'Song not found' });

        if (req.user._id.toString() !== song.creatorId.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to update this song' });
        }
        const updatedSong = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: 'Song updated', song: updatedSong });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete a song by ID (Admin only)
exports.deleteSong = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admins only' });
        }
        const song = await Song.findById(req.params.id);
        if (!song) return res.status(404).json({ message: 'Song not found' });
        await Song.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Song deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update song visibility (Admin only)
exports.setSongVisibility = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admins only' });
        }
        const { visibility } = req.body;
        if (typeof visibility !== 'boolean') {
            return res.status(400).json({ message: 'Invalid visibility value' });
        }
        const song = await Song.findById(req.params.id);
        if (!song) return res.status(404).json({ message: 'Song not found' });
        song.visibility = visibility;
        await song.save();
        res.status(200).json({ message: 'Song visibility updated', song });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
