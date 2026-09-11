import express from "express";
import { submitRegistration } from "../controllers/servicerequest_oncampusregister.js";
import { serviceRequestLimiter } from "../middlewares/ratelimiter/index.js";

const router = express.Router();

/**
 * POST /api/register-on-campus
 * Register for on-campus services
 * 
 * Rate Limit: Uses serviceRequestLimiter
 * - Window: 1 hour
 * - Max: 10 requests per hour
 * - Key: email + IP combination
 */
router.post("/register-on-campus", serviceRequestLimiter, submitRegistration);

export default router;