import express from "express";
import { scheduleInterview } from "../controllers/servicerequestInterviewcontrollerController.js";

const router = express.Router();

router.post("/schedule-interview", scheduleInterview);

export default router;
