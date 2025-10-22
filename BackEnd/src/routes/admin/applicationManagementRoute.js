import express from "express";
import adminAuth from "../../middlewares/adminMiddleware.js";
import {
    getApplicationOverView,
    getAllApplications
    } from "../../controllers/admin/applicationManagementController.js"

const router = express.Router();

// Apply admin authentication 
// router.use(adminAuth); ---> commented for API testing purpose

// get reports of user status(active,pending,blocked)
router.get('/overviewdata', getApplicationOverView);

// get all applications data 
router.get('/getrelationdata', getAllApplications);

export default router;
