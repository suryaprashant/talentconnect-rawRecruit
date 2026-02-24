import express from "express";
import adminAuth from "../../middlewares/adminMiddleware.js";
import {getAdminDashboardOverView, getAdminScheduledInterviews, scheduleInterviewByAdmin} from "../../controllers/admin/adminDashboardController.js"
import { getPendingReferralJobsForAdmin, updateReferralJobApprovalStatus ,getAcceptedReferralJobsForAdmin} from "../../controllers/admin/jobDriveManagementController.js";
import { getReferralApplicationsForAdmin, updateReferralApplicationStatus } from "../../controllers/admin/applicationManagementController.js";

const router = express.Router();

// Apply admin authentication to all dashboard routes
router.use(adminAuth);

// Admin dashboard overview
router.get('/overviewdata', getAdminDashboardOverView);
router.get("/overview", getAdminDashboardOverView);

router.get(
  "/referral-jobs/pending",
  adminAuth,
  getPendingReferralJobsForAdmin
);

router.get(
  "/referral-jobs/accepted",
  adminAuth,
  getAcceptedReferralJobsForAdmin
);


//admin approve/reject step 2
router.patch(
  "/referral-jobs/:jobId/approval",
  adminAuth,
  updateReferralJobApprovalStatus
);

// GET referral job applications
router.get(
  "/referral-applications",
  adminAuth,
  getReferralApplicationsForAdmin
);

// PATCH approve / reject referral application
router.patch(
  "/referral-applications/:applicationId",
  adminAuth,
  updateReferralApplicationStatus
);

//admin schedule interview for referral application
router.post(
  "/admin/schedule-interview",
  adminAuth,
  scheduleInterviewByAdmin
);


//admin get interview call
router.get(
  "/interviews",
  adminAuth,
  getAdminScheduledInterviews
);
export default router;