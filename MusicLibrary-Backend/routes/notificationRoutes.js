const express = require('express');
const router = express.Router();
const { 
       createNotification, 
       getAllNotifications, 
       getNotificationById, 
       deleteNotification, 
       updateNotification 
} = require('../controllers/notificationController');
const { protect, admin } = require('../middleware/authMiddleware'); 

// admin and user routes
router.get('/', protect, getAllNotifications);

// admin routes
router.post('/', protect, admin, createNotification);
router.get('/:id', protect, getNotificationById);
router.delete('/:id', protect, admin, deleteNotification);
router.put('/:id', protect, admin, updateNotification);

module.exports = router;
