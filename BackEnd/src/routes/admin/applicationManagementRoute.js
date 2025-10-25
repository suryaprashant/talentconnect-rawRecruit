import express from "express";
import adminAuth from "../../middlewares/adminMiddleware.js";
import {
    getApplicationOverView,
    getAllApplications,
    getApplicationsBoardOverView
} from "../../controllers/admin/applicationManagementController.js"

const router = express.Router();

// Apply admin authentication 
router.use(adminAuth);

// Get application overview (statistics)
router.get('/overviewdata', getApplicationOverView);

// Get all applications with pagination and filtering
router.post('/applications-board', getApplicationsBoardOverView);

// Get all applications data 
router.get('/getrelationdata', getAllApplications);

export default router;