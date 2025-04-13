const express = require('express');
const router = express.Router();
const { 
  getAllSongs, 
  getSongById, 
  getSongsByName, 
  getSongsByAlbum, 
  getSongsByMusicDirector, 
  getSongsBySinger, 
  createSong, 
  updateSong, 
  deleteSong, 
  setSongVisibility 
} = require('../controllers/songsController');
const {protect, admin}= require('../middleware/authMiddleware'); 

// Admin routes
router.post('/', protect, admin, createSong); 
router.put('/:id', protect, admin, updateSong); 
router.delete('/:id', protect, admin, deleteSong); 
router.put('/visibility/:id', protect, admin, setSongVisibility); 

// Admin and User routes
router.get('/', protect, getAllSongs); 
router.get('/:id', protect, getSongById); 
router.get('/name/:name', protect, getSongsByName); 
router.get('/album/:album', protect, getSongsByAlbum); 
router.get('/music-director/:musicDirector', protect, getSongsByMusicDirector); 
router.get('/singer/:singer', protect, getSongsBySinger); 


module.exports = router;
