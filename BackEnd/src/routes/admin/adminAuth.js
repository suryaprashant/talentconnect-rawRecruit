import express from "express";
import { adminLogin, createAdmin, adminLogout } from "../../controllers/authentication/adminAuthController.js";
import adminAuth from "../../middlewares/adminMiddleware.js";
import {
    loginLimiter,
    signupLimiter,
    adminLimiter,
} from "../../middlewares/ratelimiter/index.js";

const router = express.Router();

// ============================================================
// Admin Authentication Routes
// ============================================================

// Admin login - uses loginLimiter (5 per minute)
router.post(
    "/login",
    loginLimiter,
    adminLogin
);

// Create admin (initial admin setup) - uses signupLimiter (5 per hour)
router.post(
    "/create",
    signupLimiter,
    createAdmin
);

// Admin logout - uses adminLimiter (300 per minute)
router.post(
    "/logout",
    adminLimiter,
    adminLogout
);

// Test route to verify admin authentication - uses adminLimiter (300 per minute)
router.get(
    "/verify",
    adminAuth,
    adminLimiter,
    (req, res) => {
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
    }
);

export default router;