import { getReceiverSocketId, io } from "../socketIO/server.js";
import Conversation from "../models/conversationModel.js";
import Message from "../models/message.model.js";
import Auth from "../models/authModel.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id; // current logged in user
    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
      conversation = await Conversation.create({
        members: [senderId, receiverId],
      });
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });
    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }
    // await conversation.save()
    // await newMessage.save();
    await Promise.all([conversation.save(), newMessage.save()]); // run parallel
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const getMessage = async (req, res) => {
  try {
    const { id: chatUser } = req.params;
    const senderId = req.user._id; 

    let conversation = await Conversation.findOne({
      members: { $all: [senderId, chatUser] },
    }).populate("messages");

    if (!conversation) {
      return res.status(201).json([]);
    }
    const messages = conversation.messages || [];

      // Mark messages as read when fetching
    await Message.updateMany(
      {
        _id: { $in: messages.map(msg => msg._id) },
        receiverId: senderId,
        read: { $ne: true }
      },
      { $set: { read: true } }
    );

 
    res.status(201).json(messages);
  } catch (error) {
    console.log("Error in getMessage", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// controller to get unread message count 
export const getUnreadCount = async (req, res) => {
  try {
    const senderId = req.user._id;
    
    const unreadCounts = await Conversation.aggregate([
      { $match: { members: { $in: [senderId] } } },
      { $unwind: "$messages" },
      {
        $lookup: {
          from: "messages",
          localField: "messages",
          foreignField: "_id",
          as: "messageData"
        }
      },
      { $unwind: "$messageData" },
      {
        $match: {
          "messageData.receiverId": senderId,
          "messageData.read": false
        }
      },
      {
        $group: {
          _id: "$messageData.senderId",
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.status(200).json(unreadCounts);
  } catch (error) {
    console.log("Error in getUnreadCount", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const allUsers = async (req, res) => {
 
  try {
    const loggedInUserId = req.user._id;

    if (!loggedInUserId) {
      console.error("Error in allUsers Controller: loggedInUserId is missing after secureRoute");
      return res.status(401).json({ message: "Unauthorized: User ID not found." });
    }


    const allUsers = await Auth.find({
      _id: { $ne: loggedInUserId }
    }).select("-password");

   
    const conversations = await Conversation.find({
      members: { $in: [loggedInUserId] }
    })
    .populate('messages')
    .sort({ updatedAt: -1 });

    
    const userLastInteraction = new Map();
    
    conversations.forEach(conversation => {
      const otherUserId = conversation.members.find(member => 
        member._id.toString() !== loggedInUserId.toString()
      );
      
      if (otherUserId) {
        const lastMessage = conversation.messages[conversation.messages.length - 1];
        userLastInteraction.set(otherUserId._id.toString(), {
          lastInteraction: lastMessage ? lastMessage.createdAt : conversation.updatedAt,
          hasUnread: false // We'll implement this later
        });
      }
    });

    
    const sortedUsers = allUsers.sort((a, b) => {
      const aInteraction = userLastInteraction.get(a._id.toString());
      const bInteraction = userLastInteraction.get(b._id.toString());
      
     
      if (aInteraction && bInteraction) {
        return new Date(bInteraction.lastInteraction) - new Date(aInteraction.lastInteraction);
      }
      
      if (aInteraction && !bInteraction) return -1;
   
      if (!aInteraction && bInteraction) return 1;
      
   
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.status(200).json(sortedUsers);
  } catch (error) {
    console.error("Error in allUsers Controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};