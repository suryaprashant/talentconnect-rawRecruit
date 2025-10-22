import express from "express";
import adminAuth from "../../middlewares/adminMiddleware.js";
import {
  getServiceRequestOverView,
  getAllServiceRequest
} from "../../controllers/admin/serviceRequestManagementController.js";

const router = express.Router();

// Middleware: admin authentication
// Uncomment the line below when deploying
// router.use(adminAuth);

// Route: Get overview of service requests
router.get('/overviewdata', getServiceRequestOverView);

// Route: Get all service request applications
router.get('/getrelationdata', getAllServiceRequest);

export default router;
