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

const router = express.Router();

/**
 * ===============================================================
 * Authentication
 * ===============================================================
 */

router.post(
    "/signup",
    signupLimiter,
    signup
);

router.post(
    "/login",
    loginLimiter,
    login
);

router.post(
    "/refresh",
    refreshTokenLimiter,
    refreshToken
);

/**
 * ===============================================================
 * OAuth
 * ===============================================================
 */

router.post(
    "/google",
    googleLoginLimiter,
    googleAuth
);

/**
 * LinkedIn redirect endpoint.
 *
 * Small limiter to avoid abuse.
 */

router.get(
    "/linkedin",
    linkedInLoginLimiter,
    redirectToLinkedIn
);

/**
 * Callback from LinkedIn.
 *
 * Usually I DO NOT rate limit callbacks because
 * LinkedIn itself redirects users here.
 */

router.get(
    "/linkedin/callback",
    handleLinkedInCallback
);

/**
 * ===============================================================
 * Email OTP
 * ===============================================================
 */

router.post(
    "/send-otp",
    sendEmailOtpLimiter,
    sendSignupOtp
);

/**
 * ===============================================================
 * Password Reset
 * ===============================================================
 */

router.post(
    "/forgot-password",
    forgotPasswordLimiter,
    requestPasswordReset
);

router.post(
    "/validate-reset-token",
    validateResetTokenLimiter,
    validateResetToken
);

router.post(
    "/reset-password",
    resetPasswordLimiter,
    resetPassword
);

/**
 * ===============================================================
 * Protected User APIs
 * ===============================================================
 */

router.get(
    "/me",
    secureRoute,
    getMe
);

router.post(
    "/logout",
    secureRoute,
    logout
);

router.delete(
    "/delete",
    secureRoute,
    deleteAccountLimiter,
    deleteAccount
);

/**
 * ===============================================================
 * User Lookup
 * ===============================================================
 *
 * If this API is public,
 * consider creating a READ_PROFILE_POLICY.
 */

router.get(
    "/user/:id",
    getUserById
);

/**
 * ===============================================================
 * Statistics
 * ===============================================================
 *
 * If this becomes an admin endpoint later,
 * switch to adminLimiter.
 */

router.post(
    "/getcount/toteluser",
    getCountOfTotalUsers
);

/**
 * ===============================================================
 * Device Token
 * ===============================================================
 */

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

            await Auth.findByIdAndUpdate(
                req.user._id,
                { deviceToken }
            );

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
    }
);

export default router;