import express from 'express';
import { deleteJob, getEmployerJobs, getPostedJobs, getReferralApplicationsForProfessional ,deleteReferralJob} from '../controllers/jobManagementController.js';
import secureRoute from '../middlewares/secureRouteMiddleware.js';
// import { getCollegePostedJobs } from '../controllers/collegeJobManagementController.js';
import { reactivateJob } from "../controllers/jobReactivateController.js";
import {
    searchLimiter,
    adminLimiter,
    deleteAccountLimiter,
    applicationLimiter,
} from "../middlewares/ratelimiter/index.js";

// PATCH /company/jobmanagement/reactivate/:jobId
const router = express.Router();

// api '../company/jobmanagement'

// ============================================================
// Job Management Routes
// ============================================================

// DELETE job - uses deleteAccountLimiter (2 per day)
router.delete(
    '/:jobId',
    secureRoute,
   
    deleteJob
);

// PATCH delete referral job - uses deleteAccountLimiter (2 per day)
router.patch(
    '/referral/:jobId',
    secureRoute,
    
    deleteReferralJob
);

// GET all posted jobs - uses searchLimiter (60 per minute)
router.get(
    '/',
    secureRoute,
    searchLimiter,
    getPostedJobs
);

// GET employer jobs by type - uses searchLimiter (60 per minute)
router.get(
    '/employer/:jobType',
    secureRoute,
    searchLimiter,
    getEmployerJobs
);

// GET professional referral applications - uses searchLimiter (60 per minute)
router.get(
    "/professional/referral-applications",
    secureRoute,
    searchLimiter,
    getReferralApplicationsForProfessional
);

// PATCH reactivate job - uses applicationLimiter (30 per hour)
router.patch(
    '/reactivate/:jobId',
    secureRoute,
   
    reactivateJob
);

// Commented out routes for reference
// router.get('/offcampus/applications/:jobId', secureRoute, getOffcampusJobApplicants);
// router.get('offcampus/applications:id')

export default router;