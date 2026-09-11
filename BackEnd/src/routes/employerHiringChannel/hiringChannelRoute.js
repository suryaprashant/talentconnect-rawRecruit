import express from 'express';
import secureRoute from '../../middlewares/secureRouteMiddleware.js';
import { createInternshipPosting, createJobPosting, createOffCampusJobPosting, createOnCampusPosting, createPoolCampusPosting } from '../../controllers/employerHiringChannel/hiringChannelController.js';
import {
    applicationLimiter,
} from "../../middlewares/ratelimiter/index.js";

const router = express.Router();

// ============================================================
// Employer Hiring Channel Routes
// ============================================================

// POST create job posting - uses applicationLimiter (30 per hour)
router.post(
    '/create-job-postingg',
    secureRoute,
    applicationLimiter,
    createJobPosting
);

// POST create on-campus job - uses applicationLimiter (30 per hour)
router.post(
    '/create-Oncampusjob',
    secureRoute,
    applicationLimiter,
    createOnCampusPosting
);

// POST create pool campus job - uses applicationLimiter (30 per hour)
router.post(
    '/create-poolCampusJob',
    secureRoute,
    applicationLimiter,
    createPoolCampusPosting
);

// POST create off-campus job - uses applicationLimiter (30 per hour)
router.post(
    '/create-offCampusJob',
    secureRoute,
    applicationLimiter,
    createOffCampusJobPosting
);

// POST create internship posting - uses applicationLimiter (30 per hour)
router.post(
    '/create-internship-posting',
    secureRoute,
    applicationLimiter,
    createInternshipPosting
);

export default router;