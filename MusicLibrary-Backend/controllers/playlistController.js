const Playlist = require('../models/Playlist');
const Song = require('../models/Songs'); 

// Create a new playlist (Users only)
exports.createPlaylist = async (req, res) => {
    try {
        if (req.user.role === 'admin') {
            return res.status(403).json({ message: 'Admins cannot create playlists' });
        }
        const { name, songs } = req.body;
        const playlist = new Playlist({
            name,
            userId: req.user._id,
            songs: songs || []
        });
        await playlist.save();
        res.status(201).json({ message: 'Playlist created', playlist });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all playlists (Admins see all playlists and Users see only their own playlists)
exports.getUserPlaylists = async (req, res) => {
    try {
        const query = req.user.role !== 'admin' ? { userId: req.user._id } : {};
        const playlists = await Playlist.find(query).populate('songs');

        if (playlists.length === 0) return res.status(404).json({ message: 'No playlists found' });
        res.status(200).json(playlists);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get a specific playlist by ID (Admins see all playlists and Users see only their playlists)
exports.getPlaylistById = async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id).populate('songs');
        if (!playlist) return res.status(404).json({ message: 'Playlist not found' });

        if (req.user.role !== 'admin' && req.user._id.toString() !== playlist.userId.toString()) {
            return res.status(403).json({ message: 'You are not authorized to view this playlist' });
        }
        res.status(200).json(playlist);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Add song to playlist
exports.addSongToPlaylist = async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id);
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        if (playlist.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to modify this playlist' });
        }
        const songIds = req.body.songIds;  
        if (!Array.isArray(songIds)) {
            return res.status(400).json({ message: 'Invalid data format' });
        }
        let songsAlreadyInPlaylist = [];
        let songsToAdd = [];

        for (const songId of songIds) {
            const song = await Song.findById(songId);
            if (!song) {
                return res.status(404).json({ message: `Song with ID ${songId} not found` });
            }
            if (playlist.songs.includes(song._id)) {
                songsAlreadyInPlaylist.push(song._id);
            } else {
                songsToAdd.push(song._id);
            }
        }
        if (songsToAdd.length > 0) {
            playlist.songs.push(...songsToAdd);
            await playlist.save();
        }
        const response = {
            message: 'Songs added to playlist',
            playlist,
            songsAlreadyInPlaylist
        };
        if (songsAlreadyInPlaylist.length > 0) {
            response.message = 'Some songs were already in the playlist';
        }
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

// Remove a song from a playlist (Users only)
exports.removeSongFromPlaylist = async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id);
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        if (playlist.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to modify this playlist' });
        }
        playlist.songs = playlist.songs.filter(songId => songId.toString() !== req.body.songId);
        await playlist.save();
        res.status(200).json({ message: 'Song removed from playlist', playlist });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Update a playlist (Users can update their playlists)
exports.updatePlaylist = async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id);
        if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
        if (req.user.role === 'admin' || req.user._id.toString() !== playlist.userId.toString()) {
            return res.status(403).json({ message: 'You are not authorized to update this playlist' });
        }
        const updatedPlaylist = await Playlist.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: 'Playlist updated', playlist: updatedPlaylist });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete a playlist by ID (Users can only delete their playlists)
exports.deletePlaylist = async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id);

        if (!playlist) return res.status(404).json({ message: 'Playlist not found' });

        if (req.user.role === 'admin' || req.user._id.toString() !== playlist.userId.toString()) {
            return res.status(403).json({ message: 'You are not authorized to delete this playlist' });
        }
        await Playlist.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Playlist deleted' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error', error });
    }
};

//Search songs in playlists
exports.searchSongInPlaylists = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Song name is required' });
        }
        const regex = new RegExp(name, 'i');
        const matchingSongs = await Song.find({ name: regex });
        if (matchingSongs.length === 0) {
            return res.status(404).json({ message: 'No songs found matching your search criteria' });
        }
        const matchingSongIds = matchingSongs.map(song => song._id);
        const query = req.user.role !== 'admin' ? { userId: req.user._id, songs: { $in: matchingSongIds } } : { songs: { $in: matchingSongIds } };
        const playlists = await Playlist.find(query).populate('songs');
        if (playlists.length === 0) {
            return res.status(404).json({ message: 'No playlists contain the searched songs' });
        }
        res.status(200).json(playlists);
    } catch (error) {
       
        res.status(500).json({ message: 'Server error', error });
    }
};

// PlaySong in playlist button
exports.playPlaylist = async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id).populate('songs');
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        if (req.user.role !== 'admin' && req.user._id.toString() !== playlist.userId.toString()) {
            return res.status(403).json({ message: 'You are not authorized to play this playlist' });
        }
        const songToPlay = playlist.songs[0]; 
        res.status(200).json({ message: `Playing song: ${songToPlay.name}` });  //display message
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Stopsong in playlist with button
exports.stopPlaylist = async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id);
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        res.status(200).json({ message: 'Playback stopped' });    //message display
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Shuffle songs in playlist
exports.shufflePlaylist = async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id).populate('songs');
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        const shuffledSongs = playlist.songs.slice(); 
        for (let i = shuffledSongs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledSongs[i], shuffledSongs[j]] = [shuffledSongs[j], shuffledSongs[i]];
        }
        res.status(200).json({ message: 'Playlist shuffled', shuffledSongs });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error', error });
    }
};

// To repeat songs
exports.repeatPlaylist = async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id).populate('songs');
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        const repeatMode = req.body.repeatMode || 'all'; 
        let message;
        if (repeatMode === 'one') {
            const songToRepeat = playlist.songs[0]; 
            message = `Repeating song: ${songToRepeat.name}`;
        } else {
            message = 'Repeating entire playlist';
        }
        res.status(200).json({ message });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error', error });
    }
};

