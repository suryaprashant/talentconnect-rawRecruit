import express from 'express';
import secureRoute from '../middlewares/secureRouteMiddleware.js';

import { createOffCampusJobPosting, createOnCampusPosting, createPoolCampusPosting, createJobPosting, createInternshipPosting, createOnCampusCollegeRequest, createPoolCampusCollegeRequest, createRefferralPosting } from '../controllers/jobPostingController.js';
import { ViewController } from '../controllers/viewCountController.js';
import { getRelevantOffCampusJobs } from '../controllers/relevantJobContoller.js';
import {
    applicationLimiter,
    adminLimiter,
    searchLimiter,
} from "../middlewares/ratelimiter/index.js";

// api.. "/api/hiring-channels"

const router = express.Router();

// ============================================================
// Hiring Channels / Job Posting Routes
// ============================================================

// POST off-campus job - uses applicationLimiter (30 per hour)
router.post(
    "/off-campus",
    secureRoute,
    applicationLimiter,
    createOffCampusJobPosting
);

// POST on-campus job - uses applicationLimiter (30 per hour)
router.post(
    "/on-campus",
    secureRoute,
    applicationLimiter,
    createOnCampusPosting
);

// POST pool-campus job - uses applicationLimiter (30 per hour)
router.post(
    "/pool-campus",
    secureRoute,
    applicationLimiter,
    createPoolCampusPosting
);

// POST pool-campus college request - uses applicationLimiter (30 per hour)
router.post(
    "/pool-campus/college-request",
    secureRoute,
    applicationLimiter,
    createPoolCampusCollegeRequest
);

// POST job posting - uses applicationLimiter (30 per hour)
router.post(
    "/job-posting",
    secureRoute,
    applicationLimiter,
    createJobPosting
);

// POST internship posting - uses applicationLimiter (30 per hour)
router.post(
    "/internship-posting",
    secureRoute,
    applicationLimiter,
    createInternshipPosting
);

// POST on-campus college request - uses applicationLimiter (30 per hour)
router.post(
    "/on-campus/college-request",
    secureRoute,
    applicationLimiter,
    createOnCampusCollegeRequest
);

// POST referral posting - uses applicationLimiter (30 per hour)
router.post(
    "/referral-posting",
    secureRoute,
    applicationLimiter,
    createRefferralPosting
);

// POST view counter - uses searchLimiter (60 per minute)
router.post(
    '/view/:jobId',
    secureRoute,
    searchLimiter,
    ViewController
);

// Note: getRelevantOffCampusJobs is imported but not used in this file
// If you need it, add a GET route for it:
// router.get("/relevant-offcampus", secureRoute, searchLimiter, getRelevantOffCampusJobs);

export default router;