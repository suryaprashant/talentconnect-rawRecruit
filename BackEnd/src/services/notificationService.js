import Notification from "../models/notificationModel.js";

export async function getNotificationService(Id) {
    try {
        const response = await Notification.find({ recipientId: Id })
            .populate('senderId', 'name profileImage') // Get sender's name and image
            .sort({ createdAt: -1 });
        return response;
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed");
    }
}

export async function getNotificationByIdService(Id) {
    try {
        const response = await Notification.findById(Id);
        return response;
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed");
    }
}

export async function markAsReadService(Id) {
    try {
        const response = await Notification.findById(Id);
        return response;
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed");
    }
}