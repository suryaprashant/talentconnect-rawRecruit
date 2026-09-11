// src/routes/auth.js

import express from "express";

import {
  signup,
  login,
  logout,
  refreshToken,
  getCountOfTotalUsers,
  sendSignupOtp,
  getMe,
  getUserById,
  deleteAccount,
  verifyBackupOtp,
} from "../controllers/authentication/manualAuthController.js";

import { googleAuth } from "../controllers/authentication/googleAuthController.js";

import {
  redirectToLinkedIn,
  handleLinkedInCallback,
} from "../controllers/authentication/linkedInAuthController.js";

import {
  requestPasswordReset,
  validateResetToken,
  resetPassword,
} from "../controllers/authentication/forgotPasswordController.js";

import secureRoute from "../middlewares/secureRouteMiddleware.js";
import Auth from "../models/authModel.js";

import {
  loginLimiter,
  signupLimiter,
  googleLoginLimiter,
  linkedInLoginLimiter,
  sendEmailOtpLimiter,
  validateResetTokenLimiter,
  forgotPasswordLimiter,
  resetPasswordLimiter,
  refreshTokenLimiter,
  deleteAccountLimiter,
  deviceTokenLimiter,
} from "../middlewares/ratelimiter/index.js";

import adminAuth from "../middlewares/adminMiddleware.js";

const router = express.Router();

/**
 * ===============================================================
 * Authentication
 * ===============================================================
 */

router.post("/signup", signupLimiter, signup);

router.post("/login", loginLimiter, login);

router.post("/refresh", refreshTokenLimiter, refreshToken);

router.post("/google", googleLoginLimiter, googleAuth);

router.get("/linkedin", linkedInLoginLimiter, redirectToLinkedIn);

router.get("/linkedin/callback", handleLinkedInCallback);

router.post("/send-otp", sendEmailOtpLimiter, sendSignupOtp);

router.post("/verify-otp", adminAuth, verifyBackupOtp);

router.post("/forgot-password", forgotPasswordLimiter, requestPasswordReset);

router.post(
  "/validate-reset-token",
  validateResetTokenLimiter,
  validateResetToken,
);

router.post("/reset-password", resetPasswordLimiter, resetPassword);

router.get("/me", secureRoute, getMe);

router.post("/logout", secureRoute, logout);

router.delete("/delete", secureRoute, deleteAccountLimiter, deleteAccount);

router.get("/user/:id", getUserById);

router.post("/getcount/toteluser", getCountOfTotalUsers);

router.patch(
  "/device-token",
  secureRoute,
  deviceTokenLimiter,
  async (req, res) => {
    try {
      const { deviceToken } = req.body;

      if (!deviceToken) {
        return res.status(400).json({
          success: false,
          message: "deviceToken is required",
        });
      }

      await Auth.findByIdAndUpdate(req.user._id, { deviceToken });

      return res.status(200).json({
        success: true,
        message: "Device token updated successfully.",
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },
);

export default router;
