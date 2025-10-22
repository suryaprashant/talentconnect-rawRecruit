import express from "express";
import adminAuth from "../../middlewares/adminMiddleware.js";
import {getAdminDashboardOverView} from "../../controllers/admin/adminDashboardController.js"

const router = express.Router();

// Apply admin authentication to all dashboard routes
// router.use(adminAuth);  ------> commented for API tesing

// Admin dashboard overview
router.get('/overviewdata', getAdminDashboardOverView);
router.get("/overview", async (req, res) => {
  try {
    // TODO: Implement dashboard overview logic
    res.status(200).json({
      success: true,
      message: "Admin dashboard overview",
      data: {
        totalUsers: 0,
        totalCompanies: 0,
        totalColleges: 0,
        totalApplications: 0,
        recentActivity: []
      }
    });
  } catch (error) {
    console.error('Admin Dashboard Overview Error:', error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
});

// Get all users
router.get("/users", async (req, res) => {
  try {
    // TODO: Implement get all users logic
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: []
    });
  } catch (error) {
    console.error('Get Users Error:', error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
});

// Get all companies
router.get("/companies", async (req, res) => {
  try {
    // TODO: Implement get all companies logic
    res.status(200).json({
      success: true,
      message: "Companies retrieved successfully",
      data: []
    });
  } catch (error) {
    console.error('Get Companies Error:', error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
});

// Get all colleges
router.get("/colleges", async (req, res) => {
  try {
    // TODO: Implement get all colleges logic
    res.status(200).json({
      success: true,
      message: "Colleges retrieved successfully",
      data: []
    });
  } catch (error) {
    console.error('Get Colleges Error:', error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
});

export default router;
