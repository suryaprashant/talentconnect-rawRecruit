import express from "express";
import adminAuth from "../../middlewares/adminMiddleware.js";
import {
    getJobDriveOverView,
    getAllPositions,
    getJobsBoardOverView
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

export default router;
