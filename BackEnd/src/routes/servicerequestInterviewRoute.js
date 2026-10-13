import express from "express";
import { scheduleInterview } from "../controllers/servicerequestInterviewcontrollerController.js";
import { serviceRequestLimiter } from "../middlewares/ratelimiter/index.js";

const router = express.Router();


router.post("/schedule-interview", serviceRequestLimiter, scheduleInterview);

export default router;