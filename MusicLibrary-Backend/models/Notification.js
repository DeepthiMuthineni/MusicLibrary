const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    message: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'            // Refers to Admin
    }

  });
  
  module.exports = mongoose.model('Notification', notificationSchema);
  