import express from "express";

import secureRoute from "../middlewares/secureRouteMiddleware.js"
import { getMessage, sendMessage } from "../controllers/messageController.js";
// import { getMessages, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/get/:id", secureRoute , getMessage);
router.post("/send/:id", secureRoute, sendMessage);

export default router;