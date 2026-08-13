import express from "express";
import adminAuth from "../../middlewares/adminMiddleware.js";
import {
  getAdminDashboardOverView,
  getAdminScheduledInterviews,
  scheduleInterviewByAdmin,
} from "../../controllers/admin/adminDashboardController.js";
import {
  getPendingReferralJobsForAdmin,
  updateReferralJobApprovalStatus,
  getAcceptedReferralJobsForAdmin,
  updateJobVisibilityThreshold,
  getJobVisibilityThreshold,
} from "../../controllers/admin/jobDriveManagementController.js";
import {
  getReferralApplicationsForAdmin,
  updateReferralApplicationStatus,
} from "../../controllers/admin/applicationManagementController.js";
import {
  getRelevancyWeights,
  updateRelevancyWeights,
  getRelevancyWeightsProfessional,
  updateRelevancyWeightsProfessional,
} from "../../controllers/Relevancyweightscontroller.js";
import {
  searchLimiter,
  adminLimiter,
  applicationLimiter,
  deleteAccountLimiter,
} from "../../middlewares/ratelimiter/index.js";

const router = express.Router();

// Apply admin authentication to all dashboard routes
router.use(adminAuth);

// ============================================================
// Admin Dashboard Routes
// ============================================================

// GET admin dashboard overview - uses searchLimiter (60 per minute)
router.get("/overviewdata", searchLimiter, getAdminDashboardOverView);

router.get("/overview", searchLimiter, getAdminDashboardOverView);

// GET relevancy weights - uses searchLimiter (60 per minute)
router.get("/relevancy-weights", searchLimiter, getRelevancyWeights);

// PATCH update relevancy weights - uses adminLimiter (300 per minute)
router.patch("/relevancy-weights", adminLimiter, updateRelevancyWeights);

// GET relevancy weights professional - uses searchLimiter (60 per minute)
router.get(
  "/relevancy-weights-professional",
  searchLimiter,
  getRelevancyWeightsProfessional,
);

// PATCH update relevancy weights professional - uses adminLimiter (300 per minute)
router.patch(
  "/relevancy-weights-professioanl",
  adminLimiter,
  updateRelevancyWeightsProfessional,
);

// GET pending referral jobs - uses searchLimiter (60 per minute)
router.get(
  "/referral-jobs/pending",
  searchLimiter,
  getPendingReferralJobsForAdmin,
);

// PATCH update job visibility threshold - uses adminLimiter (300 per minute)
router.patch("/updateThreshold", adminLimiter, updateJobVisibilityThreshold);

router.get("/getThreshold", adminLimiter, getJobVisibilityThreshold);

// GET accepted referral jobs - uses searchLimiter (60 per minute)
router.get(
  "/referral-jobs/accepted",
  searchLimiter,
  getAcceptedReferralJobsForAdmin,
);

// PATCH approve/reject referral job - uses adminLimiter (300 per minute)
router.patch(
  "/referral-jobs/:jobId/approval",
  adminLimiter,
  updateReferralJobApprovalStatus,
);

// GET referral applications - uses searchLimiter (60 per minute)
router.get(
  "/referral-applications",
  searchLimiter,
  getReferralApplicationsForAdmin,
);

// PATCH approve/reject referral application - uses adminLimiter (300 per minute)
router.patch(
  "/referral-applications/:applicationId",
  adminLimiter,
  updateReferralApplicationStatus,
);

// POST admin schedule interview - uses applicationLimiter (30 per hour)
router.post(
  "/admin/schedule-interview",
  applicationLimiter,
  scheduleInterviewByAdmin,
);

// GET admin scheduled interviews - uses searchLimiter (60 per minute)
router.get("/interviews", searchLimiter, getAdminScheduledInterviews);

export default router;
