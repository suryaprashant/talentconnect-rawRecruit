import express from "express";
import { submitOffCampusInfo } from "../controllers/servicerequestOffcampusinfoController.js";
import { serviceRequestLimiter } from "../middlewares/ratelimiter/index.js";

const router = express.Router();
router.post("/offcampus/info", serviceRequestLimiter, submitOffCampusInfo);

export default router;