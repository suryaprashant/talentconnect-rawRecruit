import express from "express";
import { getCollegePostedJobs, inActiveCollegeJob } from "../controllers/collegeJobManagementController.js";
import secureRoute from '../middlewares/secureRouteMiddleware.js';
import {
    searchLimiter,
    deleteAccountLimiter,  // Changed from adminLimiter
} from "../middlewares/ratelimiter/index.js";

const router = express.Router();

// api.. /college/jobmanagement

// ============================================================
// College Job Management Routes
// ============================================================

// GET college posted jobs - uses searchLimiter (60 per minute)
router.get(
    '/:key/:jobType',
    secureRoute,
    searchLimiter,
    getCollegePostedJobs
);

// DELETE/inactivate college job - uses deleteAccountLimiter (2 per day)
router.delete(
    '/delete/:jobId',
    secureRoute,
    deleteAccountLimiter,  // 2 per day - strictest for destructive operations
    inActiveCollegeJob
);

export default router;