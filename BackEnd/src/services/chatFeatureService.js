import { getReceiverSocketId , io } from "../socketIO/server.js";
import Conversation from "../models/conversationModel.js";
import Message from "../models/message.model.js";
import Auth from "../models/authModel.js";
import mongoose from "mongoose";
import { notifyOnNewChatMessage } from "./notificationService.js";
import Onboarding from "../models/studentonboardingModel.js";
import CompanyProfile from "../models/companyDashboard/companyProfileModel.js";
import CollegeOnboarding from "../models/collegeDashboard/collegeOnboardingModel.js";
import collegeOnboardingModel from "../models/collegeDashboard/collegeOnboardingModel.js";

const resolveToAuthId = async (userId) => {
    try {
        const authUser = await Auth.findById(userId);
        if (authUser) return authUser._id;

        const [college, company, candidate] = await Promise.all([
            CollegeOnboarding.findOne({ $or: [{ _id: userId }, { userId }] }),
            CompanyProfile.findOne({ $or: [{ _id: userId }, { userId }] }),
            Onboarding.findOne({ $or: [{ _id: userId }, { userId }] })
        ]);

        const profile = college || company || candidate;
        if (profile?.userId) return profile.userId;
    } catch (err) {
        console.warn("resolveToAuthId failed:", err.message);
    }
    return userId;
};

export const createMessage = async ({
  senderId,
  receiverId,
  message,
}) => {
  const resolvedSenderId = await resolveToAuthId(senderId);
  const resolvedReceiverId = await resolveToAuthId(receiverId);

  if (mongoose.connection.readyState !== 1) {
    throw new Error("Database not connected");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    let conversation = await Conversation.findOne({
      members: { $all: [resolvedSenderId, resolvedReceiverId] },
    }).session(session);

    if (!conversation) {
      conversation = await Conversation.create(
        [
          {
            members: [resolvedSenderId, resolvedReceiverId],
          },
        ],
        { session }
      );

      conversation = conversation[0];
    }

    const newMessage = new Message({
      senderId: resolvedSenderId,
      receiverId: resolvedReceiverId,
      message,
    });

    conversation.messages.push(newMessage._id);

    await newMessage.save({ session });
    await conversation.save({ session });

    // Commit DB changes first
    await session.commitTransaction();

    // ==========================================
    // Socket + Push Notification
    // Run ONLY after successful DB commit
    // ==========================================

    try {
      const receiverSocketId = getReceiverSocketId(
        resolvedReceiverId.toString()
      );

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }

      await notifyOnNewChatMessage({
        senderId: resolvedSenderId,
        receiverId: resolvedReceiverId,
        message,
        conversationId: conversation._id,
      });
    } catch (socketError) {
      console.error(
        "Socket/notification error:",
        socketError
      );
    }

    return newMessage;
  } catch (error) {
    // Rollback all DB changes
    await session.abortTransaction();

    console.error("Create message transaction failed:", error);

    throw error;
  } finally {
    // Always close the MongoDB session
    await session.endSession();
  }
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
//
export const getSortedUsersByConversation = async ({ loggedInUserId }) => {

    console.log("=== STEP 1: loggedInUserId ===");
    console.log("value:", loggedInUserId);
    console.log("type:", typeof loggedInUserId);

    const loggedInObjectId = new mongoose.Types.ObjectId(loggedInUserId);

    console.log("=== STEP 2: Querying Conversations ===");
    const conversations = await Conversation.find({
        members: { $in: [loggedInObjectId] },
        messages: { $exists: true, $ne: [] }
    }).sort({ updatedAt: -1 });

    console.log("conversations found:", conversations.length);
    console.log("raw conversations:", JSON.stringify(conversations, null, 2));

    // ============================================
    // Fetch last message for each conversation
    // ============================================

    const lastMessageIds = conversations
        .map(conversation =>
            conversation.messages[
                conversation.messages.length - 1
            ]
        )
        .filter(Boolean);

    const lastMessages = await Message.find({
        _id: { $in: lastMessageIds }
    }).select("message");

    const messageMap = new Map(
        lastMessages.map(msg => [
            msg._id.toString(),
            msg.message
        ])
    );

    const lastMessageMap = new Map();

    conversations.forEach(conversation => {
        const otherUserId = conversation.members.find(
            member => member.toString() !== loggedInUserId.toString()
        )?.toString();

        if (!otherUserId) return;

        const lastMessageId =
            conversation.messages[
                conversation.messages.length - 1
            ]?.toString();

        lastMessageMap.set(
            otherUserId,
            messageMap.get(lastMessageId) || ""
        );
    });

    const userIds = conversations.map(conversation => {
        const otherUserId = conversation.members.find(
            member => member.toString() !== loggedInUserId.toString()
        );
        return otherUserId?.toString();
    }).filter(Boolean);

    console.log("=== STEP 3: Extracted userIds ===");
    console.log("userIds:", userIds);

    const uniqueUserIds = [...new Set(userIds)];
    console.log("uniqueUserIds:", uniqueUserIds);

    if (uniqueUserIds.length === 0) {
        console.log("⛔ STOPPING: uniqueUserIds is empty");
        return [];
    }

    const objectIds = uniqueUserIds.map(
        id => new mongoose.Types.ObjectId(id)
    );

    console.log("=== STEP 4: Querying Auth ===");
    const authUsers = await Auth.find({
        _id: { $in: objectIds }
    }).select("-password");

    console.log("authUsers found:", authUsers.length);
    console.log("authUsers:", JSON.stringify(authUsers, null, 2));

    console.log("=== STEP 5: Querying Profiles ===");

    const CollegeOnboarding =
        mongoose.model("CollegeOnboarding");

    const CompanyProfile =
        mongoose.model("CompanyProfile");

    const [
        collegeProfiles,
        companyProfiles,
        candidateProfiles
    ] = await Promise.all([
        CollegeOnboarding.find({
            userId: { $in: objectIds }
        }),
        CompanyProfile.find({
            userId: { $in: objectIds }
        }),
        Onboarding.find({
            userId: { $in: objectIds }
        })
    ]);

    console.log(
        "collegeProfiles found:",
        collegeProfiles.length
    );

    console.log(
        "companyProfiles found:",
        companyProfiles.length
    );

    console.log(
        "candidateProfiles found:",
        candidateProfiles.length
    );

    // 6. Build profile maps keyed by userId string

    const collegeMap = new Map();
    collegeProfiles.forEach(p =>
        collegeMap.set(
            p.userId.toString(),
            p
        )
    );

    const companyMap = new Map();
    companyProfiles.forEach(p =>
        companyMap.set(
            p.userId.toString(),
            p
        )
    );

    const candidateMap = new Map();
    candidateProfiles.forEach(p =>
        candidateMap.set(
            p.userId.toString(),
            p
        )
    );

    // 7. Normalize

    const normalizedUsers = authUsers.map(user => {
        const id = user._id.toString();

        const college = collegeMap.get(id);
        const company = companyMap.get(id);
        const candidate = candidateMap.get(id);

        let name,
            email,
            profileImage,
            userType;

        if (college) {

            name =
                college.collegeUniversityDetails?.collegeName;

            email =
                college.placementCoordinatorDetails?.officialEmail;

            profileImage =
                college.profileImage;

            userType = "college";

        } else if (company) {

            name =
                company.companyDetails?.companyName;

            email =
                company.employerDetails?.workEmail;

            profileImage =
                company.profileImageUrl;

            userType = "company";

        } else if (candidate) {

            name = candidate.name;

            email = candidate.email;

            profileImage =
                candidate.profileImage;

            userType =
                candidate.profileType;

        } else {

            name = user.name;
            email = user.email;
            profileImage =
                user.profileImage;
            userType =
                user.userType;
        }

        return {
            _id: id,
            name,
            email,
            profileImage,
            userType,
            last_message:
                lastMessageMap.get(id) || ""
        };
    });

    // 8. Preserve conversation order

    const userMap = new Map();

    normalizedUsers.forEach(user =>
        userMap.set(user._id, user)
    );

    return uniqueUserIds
        .map(id => userMap.get(id))
        .filter(Boolean);
};
// export const getSortedUsersByConversation = async ({ loggedInUserId }) => {
   
//     const allOtherUsers = await Auth.find({
//         _id: { $ne: loggedInUserId }
//     }).select("-password");

//     const conversations = await Conversation.find({
//         members: { $in: [loggedInUserId] }
//     })
//     .populate('messages')
//     .sort({ updatedAt: -1 });

//     const userLastInteraction = new Map();

//     conversations.forEach(conversation => {
//         const otherUser = conversation.members.find(
//             (member) => member._id.toString() !== loggedInUserId.toString()
//         );

//         if (otherUser) {
//             const lastMessage = conversation.messages[conversation.messages.length - 1];
//             userLastInteraction.set(otherUser._id.toString(), {
//                 lastInteraction: lastMessage ? lastMessage.createdAt : conversation.updatedAt
//             });
//         }
//     });

//     const sortedUsers = allOtherUsers.sort((a, b) => {
//         const aInteraction = userLastInteraction.get(a._id.toString());
//         const bInteraction = userLastInteraction.get(b._id.toString());

//         if (aInteraction && bInteraction) {
//             return new Date(bInteraction.lastInteraction) - new Date(aInteraction.lastInteraction);
//         }
//         if (aInteraction && !bInteraction) return -1;
//         if (!aInteraction && bInteraction) return 1;

//         // Fallback to sorting by creation date if no interaction
//         return new Date(b.createdAt) - new Date(a.createdAt);
//     });

//     return sortedUsers;
// };


export const getUserDetails = async ({ userId }) => {
  const user = await Auth.findById(userId).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  let profileImage = "";
  let name="";

  if (user.userType === "company") {
    const profile = await CompanyProfile.findOne({ userId });
    name=profile?.companyDetails?.companyName || "";
    profileImage = profile?.profileImageUrl || "";

//   } else if (user.userType === "college") {
//     const profile = await collegeOnboardingModel.findOne({ userId });
//     name=profile?.collegeUniversityDetails?.collegeName || "";
//     profileImage = profile?.profileImage || "";

  } else {
    const  profile = await Onboarding.findOne({ userId });
    name=profile?.name || "";
    profileImage = profile?.profileImage || "";
  }

  return {
    _id: user._id,
    name,
    email: user.email,
    userType: user.userType,
    profileImage,
  };
};