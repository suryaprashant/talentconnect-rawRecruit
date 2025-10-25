import express from "express";
import adminAuth from "../../middlewares/adminMiddleware.js";
import {getAdminDashboardOverView} from "../../controllers/admin/adminDashboardController.js"

const router = express.Router();

// Apply admin authentication to all dashboard routes
router.use(adminAuth);

// Admin dashboard overview
router.get('/overviewdata', getAdminDashboardOverView);
router.get("/overview", getAdminDashboardOverView);

export default router;