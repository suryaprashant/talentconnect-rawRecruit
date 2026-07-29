import express from "express";
import { AcceptCampusRequest, getAcceptedCampusRequest } from "../controllers/collegeApplicationController.js";
import {
    applicationLimiter,
    searchLimiter,
} from "../middlewares/ratelimiter/index.js";

const router = express.Router();

// ============================================================
// College Application Routes
// ============================================================

// POST accept campus request - uses applicationLimiter (30 per hour)
router.post(
    '/',
    applicationLimiter,
    AcceptCampusRequest
);

// GET accepted campus requests - uses searchLimiter (60 per minute)
router.get(
    '/:companyId',
    searchLimiter,
    getAcceptedCampusRequest
);

export default router;