const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  image: {
    type: String, 
    required: false
  },
  name: {                //song name
    type: String,
    required: true
  },
  singer: {
    type: String,
    required: true
  },
  musicDirector: {
    type: String,
    required: true
  },
  releaseDate: {
    type: Date,
    required: true
  },
  album: {
    type: String,
    required: true
  },
  visibility: {            //to show song to users
    type: Boolean,
    default: true
  },
  creatorId: {               // ID of creator of songs
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
});

const Song = mongoose.model('Song', songSchema);
module.exports = Song;

