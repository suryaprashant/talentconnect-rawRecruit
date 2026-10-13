import express from "express";
import { getTickerData } from "../controllers/liveTickerController.js";
import {
    searchLimiter,
} from "../middlewares/ratelimiter/index.js";

const router = express.Router();

/**
 * @route   GET /api/ticker
 * @desc    Get dynamic ticker data (applications, jobs, onboarding)
 * @access  Public
 */

// ============================================================
// Live Ticker Route (Public Read Operation)
// ============================================================

// GET ticker data - uses publicLimiter (100 per minute)
router.get(
    "/",
    searchLimiter,
    getTickerData
);

export default router;