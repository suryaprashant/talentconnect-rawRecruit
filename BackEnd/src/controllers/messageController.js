import {
  createMessage,
  getMessagesForConversation,
  findOrCreateConversation,
  getUnreadMessageCounts,
  getSortedUsersByConversation,
  getUserDetails,
  markMessagesAsReadService,
} from "../services/chatFeatureService.js";
import { getReceiverSocketId, io } from "../socketIO/server.js";

// Send message from one user to another
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    const newMessage = await createMessage({ senderId, receiverId, message });
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// get messages between two users
export const getMessage = async (req, res) => {
  try {
    const { id: chatPartnerId } = req.params;
    const userId = req.user._id;

    const messages = await getMessagesForConversation({
      userId,
      chatPartnerId,
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessage controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createConversation = async (req, res) => {
  try {
    const { receiverId } = req.body;

    console.log("recieverid", receiverId);
    const senderId = req.user._id;
    console.log(senderId);

    if (!receiverId) {
      return res.status(400).json({ error: "Receiver ID is required" });
    }
    const conversation = await findOrCreateConversation({
      senderId,
      receiverId,
    });

    res.status(200).json(conversation);
  } catch (error) {
    console.log("Error in createConversation controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;
    const unreadCounts = await getUnreadMessageCounts({ userId });
    res.status(200).json(unreadCounts);
  } catch (error) {
    console.log("Error in getUnreadCount controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const allUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const sortedUsers = await getSortedUsersByConversation({ loggedInUserId });
    res.status(200).json(sortedUsers);
  } catch (error) {
    console.error("Error in allUsers Controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const userDetails = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await getUserDetails({ userId });
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in fetching user details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const markMessagesAsRead = async (req, res) => {
  try {
    const userId = req.user._id;

    const { conversationId } = req.body;

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "conversationId is required",
      });
    }

    const result = await markMessagesAsReadService({
      conversationId,
      userId,
    });

    return res.status(200).json({
      success: true,
      message: "Messages marked as read",
      data: result,
    });
  } catch (error) {
    console.error(
      "❌ MARK READ CONTROLLER ERROR:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to mark messages as read",
    });
  }
};
