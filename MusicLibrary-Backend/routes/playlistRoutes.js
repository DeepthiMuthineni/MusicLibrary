const express = require('express');
const router = express.Router();
const { 
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addSongToPlaylist,
    removeSongFromPlaylist,
    updatePlaylist,
    deletePlaylist,
    searchSongInPlaylists,
    playPlaylist,
    stopPlaylist,
    shufflePlaylist,
    repeatPlaylist
} = require('../controllers/playlistController');
const { protect } = require('../middleware/authMiddleware');

// User routes 
router.post('/', protect, createPlaylist);
router.put('/:id', protect, updatePlaylist);
router.delete('/:id', protect, deletePlaylist);
router.post('/:id/songs', protect, addSongToPlaylist);
router.delete('/:id/songs', protect, removeSongFromPlaylist);

// Admin and User Routes(User can only view their playlists)
router.get('/', protect, getUserPlaylists);
router.get('/:id', protect, getPlaylistById);

router.post('/search', protect, searchSongInPlaylists);
router.put('/:id/play', protect, playPlaylist);        // Play playlist
router.put('/:id/stop', protect, stopPlaylist);        // Stop playlist
router.put('/:id/shuffle', protect, shufflePlaylist);  // Shuffle playlist
router.put('/:id/repeat', protect, repeatPlaylist);    // Repeat playlist

module.exports = router;
