import Notification from '../models/notificationModel.js';
import { getNotificationByIdService, getNotificationService, getUnreadNotificationService } from '../services/notificationService.js';

// Get all notifications for the logged-in user
export const getNotifications = async (req, res) => {
    
     try {
        const id = req.user._id;
        const notifications = await getNotificationService(id);
        

        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
export const getUnreadNotifications = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const notifications = await getUnreadNotificationService(userId);

    return res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching unread notifications:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
// Mark a single notification as read
export const markAsRead = async (req, res) => {
    const Id = req.params.id;
    try {
        const notification = await getNotificationByIdService(Id);

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found.' });
        }

        // Ensure the user owns this notification
        if (notification.recipientId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized.' });
        }

        notification.read = true;
        await notification.save();

        res.status(200).json(notification);
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ message: 'Server error' });
    }
};