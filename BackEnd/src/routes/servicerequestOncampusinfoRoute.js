import express from "express";
import { submitRequest } from "../controllers/servicerequestOncampusinfoController.js";
import { serviceRequestLimiter } from "../middlewares/ratelimiter/index.js";

const router = express.Router();
router.post("/request-on-campus", serviceRequestLimiter, submitRequest);

export default router;