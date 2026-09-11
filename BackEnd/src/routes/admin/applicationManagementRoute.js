import express from "express";
import adminAuth from "../../middlewares/adminMiddleware.js";
import {
    getApplicationOverView,
    getAllApplications,
    getApplicationsBoardOverView
} from "../../controllers/admin/applicationManagementController.js"
import {
    searchLimiter,
    adminLimiter,
} from "../../middlewares/ratelimiter/index.js";

const router = express.Router();

// Apply admin authentication 
router.use(adminAuth);

// ============================================================
// Admin Application Management Routes
// ============================================================

// GET application overview (statistics) - uses searchLimiter (60 per minute)
router.get(
    '/overviewdata',
    searchLimiter,
    getApplicationOverView
);

// POST applications board with pagination and filtering - uses searchLimiter (60 per minute)
router.post(
    '/applications-board',
    searchLimiter,
    getApplicationsBoardOverView
);

// GET all applications data - uses searchLimiter (60 per minute)
router.get(
    '/getrelationdata',
    searchLimiter,
    getAllApplications
);

export default router;