import express from "express";
import adminAuth from "../../middlewares/adminMiddleware.js";
import {
  getServiceRequestOverView,
  getAllServiceRequest,
  getServiceRequestBoardOverView,
  updateServiceRequestStatus
} from "../../controllers/admin/serviceRequestManagementController.js";

const router = express.Router();

// Apply admin authentication
router.use(adminAuth);

// Route: Get overview of service requests (statistics)
router.get('/overviewdata', getServiceRequestOverView);

// Route: Get all service requests with pagination and filtering
router.post('/requests-board', getServiceRequestBoardOverView);

// Route: Update service request status
router.patch('/:requestId/status', updateServiceRequestStatus);

// Route: Get all service request applications
router.get('/getrelationdata', getAllServiceRequest);

export default router;