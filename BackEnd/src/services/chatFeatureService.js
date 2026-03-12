import { getReceiverSocketId , io } from "../socketIO/server.js";
import Conversation from "../models/conversationModel.js";
import Message from "../models/message.model.js";
import Auth from "../models/authModel.js";
import mongoose from "mongoose";
import { notifyOnNewChatMessage } from "./notificationService.js";


export const createMessage = async ({ senderId, receiverId, message }) => {
    
    if (mongoose.connection.readyState !== 1) {
      throw new Error("Database not connected");
    }
    
    
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

    await Promise.all([conversation.save(), newMessage.save()]);

    // const receiverSocketId = getReceiverSocketId(receiverId);
    // if (receiverSocketId) {
    //     io.to(receiverSocketId).emit("newMessage", newMessage);
    // }

     try {
      const receiverSocketId = getReceiverSocketId(receiverId.toString());
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }

      // 🔥 Send push + optional extra socket notification
      await notifyOnNewChatMessage({
          senderId,
          receiverId,
          message,
          conversationId: conversation._id,
     });

    } catch (socketError) {
      console.error("Socket emission error:", socketError);
    }

    return newMessage;
};


export const getMessagesForConversation = async ({ userId, chatPartnerId }) => {
    const conversation = await Conversation.findOne({
        members: { $all: [userId, chatPartnerId] },
    }).populate("messages");

    if (!conversation) {
        return [];
    }
    const messages = conversation.messages || [];
    await Message.updateMany(
        {
            _id: { $in: messages.map(msg => msg._id) },
            receiverId: userId,
            read: { $ne: true }
        },
        { $set: { read: true } }
    );

    return messages;
};

export const findOrCreateConversation = async ({ senderId, receiverId }) => {
    let conversation = await Conversation.findOne({
        members: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
        conversation = await Conversation.create({
            members: [senderId, receiverId],
            messages: []
        });
    }
    const populatedConversation = await Conversation.findById(conversation._id)
        .populate('members', 'name email profileImage userType')
        .populate('messages');

    return populatedConversation;
};


export const getUnreadMessageCounts = async ({ userId }) => {
    
    const unreadCounts = await Conversation.aggregate([
        { $match: { members: { $in: [userId] } } },
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
                "messageData.receiverId": userId,
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
    return unreadCounts;
};

export const getSortedUsersByConversation = async ({ loggedInUserId }) => {
   
    const allOtherUsers = await Auth.find({
        _id: { $ne: loggedInUserId }
    }).select("-password");

    const conversations = await Conversation.find({
        members: { $in: [loggedInUserId] }
    })
    .populate('messages')
    .sort({ updatedAt: -1 });

    const userLastInteraction = new Map();

    conversations.forEach(conversation => {
        const otherUser = conversation.members.find(
            (member) => member._id.toString() !== loggedInUserId.toString()
        );

        if (otherUser) {
            const lastMessage = conversation.messages[conversation.messages.length - 1];
            userLastInteraction.set(otherUser._id.toString(), {
                lastInteraction: lastMessage ? lastMessage.createdAt : conversation.updatedAt
            });
        }
    });

    const sortedUsers = allOtherUsers.sort((a, b) => {
        const aInteraction = userLastInteraction.get(a._id.toString());
        const bInteraction = userLastInteraction.get(b._id.toString());

        if (aInteraction && bInteraction) {
            return new Date(bInteraction.lastInteraction) - new Date(aInteraction.lastInteraction);
        }
        if (aInteraction && !bInteraction) return -1;
        if (!aInteraction && bInteraction) return 1;

        // Fallback to sorting by creation date if no interaction
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return sortedUsers;
};