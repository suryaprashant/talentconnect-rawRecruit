import express from "express";
import { registerOffCampus } from "../controllers/servicerequestOffcampusregisterController.js";
import { serviceRequestLimiter } from "../middlewares/ratelimiter/index.js";

const router = express.Router();

router.post("/offcampus/register", serviceRequestLimiter, registerOffCampus);

export default router;