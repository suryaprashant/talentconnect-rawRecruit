import express from "express";

// import { fetchOpportunitiesForCollegeStudent, findRelevantJoblistingOpportunity, findRelevantOpportunityById } from "../controllers/relevantJobsController.js";
import {
    // fetchOnCampusOpportunities, 
    findJobListingOpportunityById, findOffcampusOpportunityById,
    findReferalOpportunityById,
    // findOpportunityById
} from "../controllers/jobController.js";
import secureRoute from "../middlewares/secureRouteMiddleware.js";
import verifyUser from "../middlewares/verifyUser.js";
import {
    searchLimiter,
} from "../middlewares/ratelimiter/index.js";

const router = express.Router();

// api '.../jobs'

// ============================================================
// Job Details Routes (Read Operations)
// ============================================================

// GET offcampus job details - uses searchLimiter (60 per minute)
router.get(
    '/jobDetails/:jobId',
    searchLimiter,
    findOffcampusOpportunityById
);

// GET joblisting job details - uses searchLimiter (60 per minute)
router.get(
    '/jobDetails/joblisting/:jobId',
    searchLimiter,
    findJobListingOpportunityById
);

// GET referral job details - uses searchLimiter (60 per minute)
router.get(
    '/jobDetails/referral/:jobId',
    verifyUser,
    searchLimiter,
    findReferalOpportunityById
);

// ============================================================
// Commented out routes for reference
// ============================================================
// // company
// // router.post('/:companyId', createJob);

// // colleges
// router.get('/oncampus', fetchOnCampusOpportunities);

// // user
// // find jobs to collegeStudents
// router.get('/campus/:collegeId', fetchOpportunitiesForCollegeStudent);
// // professional
// // router.get('/professional');

// router.get('/relevantjobs/offcampus', secureRoute, findRelevantOpportunityById);
// router.get('/relevantjobs/joblisting', secureRoute, findRelevantJoblistingOpportunity);
// // router.get('/campusopportunity', fetchCampusOpportunities);

// //referral
// //router.get('/jobDetails/referral/:jobId', findReferalOpportunityById);

export default router;