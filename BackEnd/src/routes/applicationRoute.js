import express from "express";
import { 
  createOffcampusApplication, 
  createIntershipApplication, 
  createJobListingApplication, 
  saveJobByUser,
  unsaveJobByUser, 
  getApplicationsByJob, 
  getCollegeApplicationsByJob, 
  createOncampusApplication, 
  createPoolcampusApplication, 
  shortlistApplicant, 
  acceptApplicant, 
  rejectApplicant, 
  getShortlistedCandidatesByCompany, 
  getAcceptedCandidatesByCompany, 
  fetchSavedJobs, 
  createCampusInternshipApplication, 
  getUserApplicationStatus, 
  createReferralApplication, 
  getShortlistedCompaniesForCollege, 
  shortlistApplicantForCompany, 
  rejectCompanyApplicationByCollege, 
  scheduleInterview,
  getCompanyDashboardMetrics,
  submitAlternateDates,
  getReferralApplicationsForProfessional,
  getProfessionalDashboardMetrics,
  updateApplicationStatus,
  getGlobalReferralApplications,
  getReferralsForCompany,
  getProfessionalReferralMetrics,
  getCandidateDashboardStats,
  getReferredCandidatesPipeline, 
  updateReferralCandidateStatus,
  getApplicationDetailsById
} from "../controllers/applicationController.js";
import secureRoute from '../middlewares/secureRouteMiddleware.js';
import {
  applicationLimiter,
  searchLimiter,
  profileUpdateLimiter,
  adminLimiter,
} from "../middlewares/ratelimiter/index.js";

const router = express.Router();

// api '.../application'

// ============================================================
// Application Status Updates
// ============================================================
router.patch(
  '/update-status/:applicationId',
  secureRoute,
  applicationLimiter,
  updateApplicationStatus
);

// ============================================================
// Saved Jobs (User Profile updates)
// ============================================================
router.post(
  "/saveopportunity",
  secureRoute,
  profileUpdateLimiter,
  saveJobByUser
);

router.delete(
  "/saveopportunity/:jobId",
  secureRoute,
  profileUpdateLimiter,
  unsaveJobByUser
);

router.get(
  "/saveopportunity",
  secureRoute,
  searchLimiter,
  fetchSavedJobs
);

// ============================================================
// Offcampus Applications
// ============================================================
router.post(
  '/candidate/offcampus',
  secureRoute,
  applicationLimiter,
  createOffcampusApplication
);

router.get(
  '/status/candidate/:jobType',
  secureRoute,
  searchLimiter,
  getUserApplicationStatus
);

// ============================================================
// Job Listing Applications
// ============================================================
router.post(
  '/candidate/joblisting',
  secureRoute,
  applicationLimiter,
  createJobListingApplication
);

// ============================================================
// Internship Applications
// ============================================================
router.post(
  '/candidate/internship',
  secureRoute,
  applicationLimiter,
  createIntershipApplication
);

// ============================================================
// Referral Applications
// ============================================================
router.post(
  '/candidate/referral',
  secureRoute,
  applicationLimiter,
  createReferralApplication
);

router.get(
  "/referrals/referred-by-me",
  secureRoute,
  searchLimiter,
  getReferredCandidatesPipeline
);

router.patch(
  "/referrals/:applicationId/status",
  secureRoute,
  profileUpdateLimiter,
  updateReferralCandidateStatus
);

// ============================================================
// Campus Applications (Oncampus, Poolcampus, Campus Internship)
// ============================================================
router.post(
  '/oncampus',
  secureRoute,
  applicationLimiter,
  createOncampusApplication
);

router.post(
  '/poolcampus',
  secureRoute,
  applicationLimiter,
  createPoolcampusApplication
);

router.post(
  '/internship',
  secureRoute,
  applicationLimiter,
  createCampusInternshipApplication
);

// ============================================================
// Company & College Management (Admin level operations)
// ============================================================

// Shortlist
router.patch(
  '/manage/shortlist/:applicationId',
  secureRoute,
  adminLimiter,
  shortlistApplicant
);

router.patch(
  '/manage/college/shortlist/:applicationId',
  secureRoute,
  adminLimiter,
  shortlistApplicantForCompany
);

router.get(
  '/manage/shortlist/',
  secureRoute,
  searchLimiter,
  getShortlistedCandidatesByCompany
);

router.get(
  '/manage/college/shortlist/',
  secureRoute,
  searchLimiter,
  getShortlistedCompaniesForCollege
);

// Reject
router.patch(
  '/manage/reject/:applicationId',
  secureRoute,
  adminLimiter,
  rejectApplicant
);

router.patch(
  "/manage/college/reject/:applicationId",
  secureRoute,
  adminLimiter,
  rejectCompanyApplicationByCollege
);

// Accept
router.patch(
  '/manage/accept/:applicationId',
  secureRoute,
  adminLimiter,
  acceptApplicant
);

router.get(
  '/manage/accept/',
  secureRoute,
  searchLimiter,
  getAcceptedCandidatesByCompany
);

// ============================================================
// Dashboard Metrics
// ============================================================
router.get(
  '/company/metrics',
  secureRoute,
  searchLimiter,
  getCompanyDashboardMetrics
);

router.get(
  '/professional/metrics',
  secureRoute,
  searchLimiter,
  getProfessionalDashboardMetrics
);

// ============================================================
// Get Applications by Job / College
// ============================================================
router.get(
  '/manage',
  secureRoute,
  searchLimiter,
  getApplicationsByJob
);

router.get(
  '/manage/college',
  secureRoute,
  searchLimiter,
  getCollegeApplicationsByJob
);

// ============================================================
// Schedule Interview
// ============================================================
router.post(
  '/manage/schedule',
  secureRoute,
  adminLimiter,
  scheduleInterview
);

// ============================================================
// Submit Alternate Dates
// ============================================================
router.post(
  '/:jobId/submit',
  secureRoute,
  applicationLimiter,
  submitAlternateDates
);

// ============================================================
// Referral Routes (Professional)
// ============================================================
router.get(
  "/my-referral-applications",
  secureRoute,
  searchLimiter,
  getReferralApplicationsForProfessional
);

router.get(
  "/all-referrals",
  secureRoute,
  searchLimiter,
  getGlobalReferralApplications
);

router.get(
  "/company/referred-candidates",
  secureRoute,
  searchLimiter,
  getReferralsForCompany
);

router.get(
  "/professional/referral-metrics",
  secureRoute,
  searchLimiter,
  getProfessionalReferralMetrics
);

// ============================================================
// Candidate Dashboard
// ============================================================
router.get(
  '/dashboard/candidate/stats',
  secureRoute,
  searchLimiter,
  getCandidateDashboardStats
);

// ============================================================
// Application Details
// ============================================================
router.get(
  '/details/:applicationId',
  secureRoute,
  searchLimiter,
  getApplicationDetailsById
);

export default router;