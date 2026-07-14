import express from "express";
import adminAuth from "../../middlewares/adminMiddleware.js";
import {
    getJobDriveOverView,
    getAllPositions,
    getJobsBoardOverView,
    getPendingReferralJobsForAdmin,
    getAcceptedReferralJobsForAdmin,
    updateReferralJobApprovalStatus,
} from "../../controllers/admin/jobDriveManagementController.js"

const router = express.Router();

// Apply admin authentication 
router.use(adminAuth);

// Get job drive overview (statistics)
router.get('/overviewdata', getJobDriveOverView);

// Get all jobs with pagination and filtering
router.post('/jobs-board', getJobsBoardOverView);

// Get all positions
router.get('/getrelationdata', getAllPositions);

// Referral job approval management
router.get('/referral-jobs/pending', getPendingReferralJobsForAdmin);
router.get('/referral-jobs/accepted', getAcceptedReferralJobsForAdmin);
router.patch('/referral-jobs/:jobId/approval', updateReferralJobApprovalStatus);

export default router;
