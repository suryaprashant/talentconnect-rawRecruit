import express from "express";
import adminAuth from "../../middlewares/adminMiddleware.js";
import {
  getServiceRequestOverView,
  getAllServiceRequest,
  getServiceRequestBoardOverView,
  updateServiceRequestStatus
} from "../../controllers/admin/serviceRequestManagementController.js";
import {
    searchLimiter,
    adminLimiter,
} from "../../middlewares/ratelimiter/index.js";

const router = express.Router();

// Apply admin authentication
router.use(adminAuth);

// ============================================================
// Admin Service Request Management Routes
// ============================================================

// GET overview of service requests (statistics) - uses searchLimiter (60 per minute)
router.get(
    '/overviewdata',
    searchLimiter,
    getServiceRequestOverView
);

// POST service requests board with pagination and filtering - uses searchLimiter (60 per minute)
router.post(
    '/requests-board',
    searchLimiter,
    getServiceRequestBoardOverView
);

// PATCH update service request status - uses adminLimiter (300 per minute)
router.patch(
    '/:requestId/status',
    adminLimiter,
    updateServiceRequestStatus
);

// GET all service request applications - uses searchLimiter (60 per minute)
router.get(
    '/getrelationdata',
    searchLimiter,
    getAllServiceRequest
);

export default router;