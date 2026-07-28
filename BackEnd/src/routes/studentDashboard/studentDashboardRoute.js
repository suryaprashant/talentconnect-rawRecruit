import express from 'express';
import { getInternshipPostings, getJobById, getIntershipById, getJobPostings, getOffCampusPostings, getOnCampusPostingForCollegebyID, getOnCampusPostingForCompanybyID, getOnCampusPostings, getOnCampusPostingsForCollege, getOnCampusPostingsForCompany, getPoolCampusForCollege, getPoolCampusForCompany, getPoolCampusJobByIdForCollege, getPoolCampusJobByIdForCompany, getReferralJobById, getReferralJobs ,getProfessionalReferrals,getProfessionalInActiveReferrals } from '../../controllers/studentDashboard/studentDashboardController.js';
import secureRoute  from '../../middlewares/secureRouteMiddleware.js';
import verifyUser from '../../middlewares/verifyUser.js';
import { getRelevantOffCampusJobs } from '../../controllers/relevantJobContoller.js';
import {
    searchLimiter,
} from "../../middlewares/ratelimiter/index.js";

const router = express.Router();

// ============================================================
// Student Dashboard Routes (Read Operations)
// ============================================================

// GET off-campus jobs - uses searchLimiter (60 per minute)
router.get(
    '/off-campus',
    verifyUser,
    searchLimiter,
    getRelevantOffCampusJobs
);

// GET on-campus jobs for company - uses searchLimiter (60 per minute)
router.get(
    '/on-campus',
    verifyUser,
    searchLimiter,
    getOnCampusPostingsForCompany
);

// GET on-campus job by ID for company - uses searchLimiter (60 per minute)
router.get(
    '/on-campus/company/:id',
    secureRoute,
    searchLimiter,
    getOnCampusPostingForCompanybyID
);

// GET on-campus jobs for college - uses searchLimiter (60 per minute)
router.get(
    '/on-campus/college',
    verifyUser,
    searchLimiter,
    getOnCampusPostingsForCollege
);

// GET on-campus job by ID for college - uses searchLimiter (60 per minute)
router.get(
    "/oncampus/college/:id",
    searchLimiter,
    getOnCampusPostingForCollegebyID
);

// GET all pool campus jobs - uses searchLimiter (60 per minute)
router.get(
    '/getAllPoolCampusJobs',
    verifyUser,
    searchLimiter,
    getPoolCampusForCollege
);

// GET pool campus jobs for college - uses searchLimiter (60 per minute)
router.get(
    '/pool-campus/college',
    verifyUser,
    searchLimiter,
    getPoolCampusForCollege
);

// GET pool campus job by ID for college - uses searchLimiter (60 per minute)
router.get(
    '/getPoolCampusJob/:id',
    verifyUser,
    searchLimiter,
    getPoolCampusJobByIdForCollege
);

// GET pool campus jobs for company - uses searchLimiter (60 per minute)
router.get(
    '/pool-campus/company',
    verifyUser,
    searchLimiter,
    getPoolCampusForCompany
);

// GET pool campus job by ID for company - uses searchLimiter (60 per minute)
router.get(
    '/pool-campus/company/:id',
    secureRoute,
    searchLimiter,
    getPoolCampusJobByIdForCompany
);

// GET job postings - uses searchLimiter (60 per minute)
router.get(
    '/job-postings',
    secureRoute,
    searchLimiter,
    getJobPostings
);

// GET internship postings - uses searchLimiter (60 per minute)
router.get(
    '/internship-postings',
    verifyUser,
    searchLimiter,
    getInternshipPostings
);

// GET internship by ID - uses searchLimiter (60 per minute)
router.get(
    '/getInternshipDetail/:id',
    searchLimiter,
    getIntershipById
);

// GET referral jobs - uses searchLimiter (60 per minute)
router.get(
    '/referral-jobs',
    verifyUser,
    searchLimiter,
    getReferralJobs
);

// GET posted referral jobs (professional) - uses searchLimiter (60 per minute)
router.get(
    '/posted-referral-job',
    secureRoute,
    searchLimiter,
    getProfessionalReferrals
);

// GET inactive posted referral jobs - uses searchLimiter (60 per minute)
router.get(
    '/inactive-posted-referral-job',
    secureRoute,
    searchLimiter,
    getProfessionalInActiveReferrals
);

// GET referral job by ID - uses searchLimiter (60 per minute)
router.get(
    '/referral-jobs/:id',
    secureRoute,
    searchLimiter,
    getReferralJobById
);

// GET job by ID - uses searchLimiter (60 per minute)
router.get(
    '/job/:jobId',
    secureRoute,
    searchLimiter,
    getJobById
);

export default router;