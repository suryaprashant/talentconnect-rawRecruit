import express from "express";
import { adminLogin, createAdmin, adminLogout } from "../../controllers/authentication/adminAuthController.js";
import adminAuth from "../../middlewares/adminMiddleware.js";

const router = express.Router();

// Admin authentication routes
router.post("/login", adminLogin);
router.post("/create", createAdmin); // For initial admin setup
router.post("/logout", adminLogout);

// Test route to verify admin authentication
router.get("/verify", adminAuth, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin authentication verified",
    user: {
      _id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      userType: req.user.userType
    }
  });
});

export default router;
