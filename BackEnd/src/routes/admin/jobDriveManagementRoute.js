import express from "express";
import adminAuth from "../../middlewares/adminMiddleware.js";
import {
    getJobDriveOverView,
    getAllPositions,
    getJobsBoardOverView
} from "../../controllers/admin/jobDriveManagementController.js"
import {
    searchLimiter,
} from "../../middlewares/ratelimiter/index.js";

const router = express.Router();

// Apply admin authentication 
router.use(adminAuth);

// ============================================================
// Admin Job Drive Management Routes
// ============================================================

// GET job drive overview (statistics) - uses searchLimiter (60 per minute)
router.get(
    '/overviewdata',
    searchLimiter,
    getJobDriveOverView
);

// POST jobs board with pagination and filtering - uses searchLimiter (60 per minute)
router.post(
    '/jobs-board',
    searchLimiter,
    getJobsBoardOverView
);

// GET all positions - uses searchLimiter (60 per minute)
router.get(
    '/getrelationdata',
    searchLimiter,
    getAllPositions
);

export default router;