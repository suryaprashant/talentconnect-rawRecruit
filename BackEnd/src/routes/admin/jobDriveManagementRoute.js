import express from "express";
import adminAuth from "../../middlewares/adminMiddleware.js";
import {
    getJobDriveOverView,
    getAllPositions
    } from "../../controllers/admin/jobDriveManagementController.js"

const router = express.Router();

// Apply admin authentication 
// router.use(adminAuth); ---> commented for API testing purpose

// get reports of user status(active,pending,blocked)
router.get('/overview', getJobDriveOverView);

// get all users data 
router.get('/getposition', getAllPositions);

export default router;
