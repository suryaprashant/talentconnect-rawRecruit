import express from "express";
import { getTickerData } from "../controllers/liveTickerController.js";

const router = express.Router();

/**
 * @route   GET /api/ticker
 * @desc    Get dynamic ticker data (applications, jobs, onboarding)
 * @access  Public
 */
router.get("/", getTickerData);

export default router;