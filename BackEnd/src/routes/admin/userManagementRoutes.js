import express from "express";
import adminAuth from "../../middlewares/adminMiddleware.js";
import {getUserBoardOverView} from "../../controllers/admin/userManagementController.js"

const router = express.Router();

// Apply admin authentication to all dashboard routes
router.use(adminAuth);

// Admin dashboard overview
router.post('/users-board', getUserBoardOverView);

export default router;
