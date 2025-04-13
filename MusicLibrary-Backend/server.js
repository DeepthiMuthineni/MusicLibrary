const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const songRoutes = require('./routes/songsRoutes');
const playlistRoutes = require('./routes/playlistRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const cors = require('cors');



dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({
  origin:['http://localhost:3000'],
  methods:['GET', 'POST', 'PUT', 'DELETE'],
}));


// mongodb connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

//routes
app.use('/api/auth', userRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/notifications',notificationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Server error!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
