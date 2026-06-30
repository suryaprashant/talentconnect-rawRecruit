import express from "express";

import secureRoute from "../middlewares/secureRouteMiddleware.js"
import { allUsers, createConversation, getMessage, getUnreadCount, sendMessage} from "../controllers/messageController.js";
// import { getMessages, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/get/:id", secureRoute , getMessage);
router.post("/send/:id", secureRoute, sendMessage);

router.get("/unread-count", secureRoute, getUnreadCount) ;

router.post("/conversation", secureRoute, createConversation) ;

router.get("/allusers" , secureRoute , allUsers) ;





export default router;