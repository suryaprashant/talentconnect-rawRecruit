import express from "express";
import { createJob } from "../controllers/servicerequestReferraljobsController.js";
import { serviceRequestLimiter } from "../middlewares/ratelimiter/index.js";

const router = express.Router();


router.post("/jobs", serviceRequestLimiter, createJob);

export default router;