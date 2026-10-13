import express from "express";
import { createStudentOverview } from "../controllers/studentController.js";
import secureRoute from "../middlewares/secureRouteMiddleware.js";
import {
    profileUpdateLimiter,
} from "../middlewares/ratelimiter/index.js";

const router = express.Router();

// ============================================================
// Student Overview Route
// ============================================================

// @route   POST /api/student-overview
// @desc    Create a new student profile
// @access  Private
router.post(
    "/studentOverview",
    secureRoute,
    profileUpdateLimiter,
    createStudentOverview
);

export default router;