import Notification from '../models/notificationModel.js';
import Auth from '../models/authModel.js';

/**
 * Send a notification to a user
 * @param {Object} notificationData - The notification data
 * @param {String} notificationData.recipientEmail - Email of the recipient
 * @param {String} notificationData.senderId - ID of the sender (company)
 * @param {String} notificationData.type - Type of notification
 * @param {String} notificationData.message - Notification message
 * @param {String} notificationData.referenceId - Optional reference ID
 * @param {String} notificationData.fileUrl - Optional file URL
 * @param {String} notificationData.fileName - Optional file name
 * @param {String} notificationData.eventTitle - Optional event title
 */
export const sendNotification = async (notificationData) => {
  try {
    const { recipientEmail, senderId, type, message, referenceId, fileUrl, fileName, eventTitle } = notificationData;

    // Find the recipient by email
    const recipient = await Auth.findOne({ email: recipientEmail });
    
    if (!recipient) {
      console.log(`Recipient not found for email: ${recipientEmail}`);
      return { success: false, error: 'Recipient not found' };
    }

    // Create the notification
    const notification = new Notification({
      recipientId: recipient._id,
      senderId,
      type,
      message,
      referenceId,
      fileUrl,
      fileName,
      eventTitle,
      read: false
    });

    await notification.save();
    console.log(`Notification sent to ${recipientEmail}`);
    
    return { success: true, notification };
  } catch (error) {
    console.error('Error sending notification:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send notifications to multiple users
 * @param {Array} recipients - Array of recipient emails
 * @param {Object} notificationData - Common notification data for all recipients
 */
export const sendBulkNotifications = async (recipients, notificationData) => {
  const results = [];
  
  for (const recipientEmail of recipients) {
    const result = await sendNotification({
      ...notificationData,
      recipientEmail
    });
    
    results.push({
      email: recipientEmail,
      success: result.success,
      error: result.error
    });
  }
  
  return results;
};
