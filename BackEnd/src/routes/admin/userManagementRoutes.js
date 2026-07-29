import express from "express";
import adminAuth from "../../middlewares/adminMiddleware.js";
import {
  getUserBoardOverView,
  updateUserStatus,
  deleteUser,
  getUserStatusCounts
} from "../../controllers/admin/userManagementController.js";
import {
    searchLimiter,
    adminLimiter,
    deleteAccountLimiter,
} from "../../middlewares/ratelimiter/index.js";

const router = express.Router();

// Apply admin authentication 
router.use(adminAuth);

// ============================================================
// Admin User Management Routes
// ============================================================

// POST users board with pagination and filtering - uses searchLimiter (60 per minute)
router.post(
    '/users-board',
    searchLimiter,
    getUserBoardOverView
);

// GET user status counts - uses searchLimiter (60 per minute)
router.get(
    '/user-status',
    searchLimiter,
    getUserStatusCounts
);

// PATCH update user status (active/pending/blocked) - uses adminLimiter (300 per minute)
router.patch(
    '/users/:userId/status',
    adminLimiter,
    updateUserStatus
);

// DELETE a user - uses deleteAccountLimiter (2 per day)
router.delete(
    '/users/:userId',
    deleteAccountLimiter,
    deleteUser
);

export default router;