import express from "express";

import secureRoute from "../middlewares/secureRouteMiddleware.js"
import { allUsers, createConversation, getMessage, getUnreadCount, sendMessage ,userDetails,markMessagesAsRead} from "../controllers/messageController.js";


import { messageReadLimiter,chatSendLimiter, unreadCountLimiter, conversationLimiter,userSearchLimiter} from "../middlewares/ratelimiter/index.js" 
// import { getMessages, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get(
    "/get/:id",
    secureRoute,
    messageReadLimiter,
    getMessage
);

router.post(
    "/send/:id",
    secureRoute,
    chatSendLimiter,
    sendMessage
);

router.get(
    "/unread-count",
    secureRoute,
    unreadCountLimiter,
    getUnreadCount
);

router.post(
    "/conversation",
    secureRoute,
    conversationLimiter,
    createConversation
);

router.post(
  "/mark-read",
  secureRoute,
  messageReadLimiter,
  markMessagesAsRead
);

router.get(
    "/allusers",
    secureRoute,
    userSearchLimiter,
    allUsers
);

router.get("/user/:id" , unreadCountLimiter, secureRoute , userDetails) ;



export default router;