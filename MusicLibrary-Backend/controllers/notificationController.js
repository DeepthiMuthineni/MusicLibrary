const Notification = require('../models/Notification');

// Create Notification
exports.createNotification = async (req, res) => {
  try {
      const { message } = req.body;
      const notification = new Notification({
          message,
          sentBy: req.user._id 
      });
      await notification.save();
      res.status(201).json({ message: 'Notification created', notification });
  } catch (error) {
      res.status(500).json({ message: 'Failed to create notification', error });
  }
};

// Get all Notifications
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().populate('sentBy', 'username'); 
    res.status(200).json(notifications);
  } catch (error) {
      res.status(500).json({ message: 'Failed to fetch notifications', error });
    }
};

//Get Notifications by ID
exports.getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id).populate('sentBy', 'username');
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.status(200).json(notification);
  } catch (error) {
      res.status(500).json({ message: 'Failed to fetch notification', error });
    }
};

// Delete Notification(Admin)
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.status(200).json({ message: 'Notification deleted' });
  } catch (error) {
      res.status(500).json({ message: 'Failed to delete notification', error });
    }
};

// Update Notification(Admin)
exports.updateNotification = async (req, res) => {
  try {
    const { message } = req.body;
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { message },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.status(200).json({ message: 'Notification updated', notification });
  } catch (error) {
      res.status(500).json({ message: 'Failed to update notification', error });
    }
};
