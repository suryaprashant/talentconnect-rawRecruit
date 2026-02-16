import express from "express";
import adminAuth from "../../middlewares/adminMiddleware.js";
import {getAdminDashboardOverView} from "../../controllers/admin/adminDashboardController.js"
import { getPendingReferralJobsForAdmin, updateReferralJobApprovalStatus } from "../../controllers/admin/jobDriveManagementController.js";
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


export default router;