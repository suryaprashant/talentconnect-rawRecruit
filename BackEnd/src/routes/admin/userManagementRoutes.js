import express from "express";
import adminAuth from "../../middlewares/adminMiddleware.js";
import {
  getUserBoardOverView,
  updateUserStatus,
  deleteUser,
  getUserStatusCounts
} from "../../controllers/admin/userManagementController.js";

const router = express.Router();

// Apply admin authentication 
router.use(adminAuth);

// Admin dashboard overview
router.post('/users-board', getUserBoardOverView);

// Get user status counts
router.get('/user-status', getUserStatusCounts);

// Update user status (active/pending/blocked)
router.patch('/users/:userId/status', updateUserStatus);

// Delete a user
router.delete('/users/:userId', deleteUser);

export default router;
