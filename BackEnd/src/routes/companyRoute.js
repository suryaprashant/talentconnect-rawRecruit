import express from "express";
import { createCompanyMasterData, createCompanyProfile, getCompanyMasterData } from "../controllers/companyController.js";
import secureRoute from "../middlewares/secureRouteMiddleware.js";
import {
    searchLimiter,
    signupLimiter,
} from "../middlewares/ratelimiter/index.js";

const router = express.Router();

// api '.../company'

// ============================================================
// Company Routes
// ============================================================

// GET dropdown values - uses searchLimiter (60 per minute)
router.get(
    "/",
    searchLimiter,
    getCompanyMasterData
);

// POST custom value (during onboarding) - uses signupLimiter (5 per hour)
router.post(
    "/",
    secureRoute,
    signupLimiter,
    createCompanyMasterData
);

// Commented out - create company profile
// router.post(
//     '/',
//     secureRoute,
//     signupLimiter,
//     createCompanyProfile
// );

export default router;