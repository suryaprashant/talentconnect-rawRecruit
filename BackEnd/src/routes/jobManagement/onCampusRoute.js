import express from 'express' ;

import { getCompanyOnCampusHiringWithApplications, getCollegesForOnCampusJob } from '../../controllers/hiringChannelsOncampusRegisterController.js';
import secureRoute from '../../middlewares/secureRouteMiddleware.js';     
import {
    searchLimiter,
} from "../../middlewares/ratelimiter/index.js";

const router = express.Router() ;

// ============================================================
// On-Campus Hiring Routes
// ============================================================

// GET all on-campus hiring drives for a company with application counts - uses searchLimiter (60 per minute)
router.get(
    '/on-campus-drives',
    secureRoute,
    searchLimiter,
    getCompanyOnCampusHiringWithApplications
);

// GET colleges for a specific on-campus job - uses searchLimiter (60 per minute)
router.get(
    '/on-campus-drives/:jobId/colleges',
    secureRoute,
    searchLimiter,
    getCollegesForOnCampusJob
);

export default router;