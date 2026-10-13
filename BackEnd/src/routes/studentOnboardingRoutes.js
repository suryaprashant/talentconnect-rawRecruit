import express from "express";
import {
  getAllOnboardingForms,
  submitOnboardingForm,
  getOnboardingForm,
  updateOnboardingForm,
  getMasterData,
  createMasterData,
  getCategorizedSkills,
  getOnboardingByUserId
} from "../controllers/studentOnboardingController.js";
import secureRoute from "../middlewares/secureRouteMiddleware.js"; 
import multer from "multer"; 
import {
    searchLimiter,
    profileUpdateLimiter,
    signupLimiter,
} from "../middlewares/ratelimiter/index.js";

const router = express.Router();

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

// ============================================================
// Student Onboarding Routes
// ============================================================

// GET all onboarding forms - uses searchLimiter (60 per minute)
router.get(
    "/onboarding",
    // secureRoute,
    searchLimiter,
    getAllOnboardingForms
);

// POST submit onboarding form with multiple file uploads - uses profileUpdateLimiter (30 per hour)
router.post(
    "/onboarding",
    secureRoute,
    profileUpdateLimiter,
    upload.fields([
        { name: "resume", maxCount: 1 },
        { name: "degreeCertificate", maxCount: 1 },
        { name: "project", maxCount: 1 },
        { name: "profileImage", maxCount: 1 }, 
        { name: "backgroundImage", maxCount: 1 },
        { name: "experienceCertificate", maxCount: 10 },
        { name: "leadershipCertificate", maxCount: 10 },
        { name: "internationalExperienceCertificate", maxCount: 10 },
        { name: "awardCertificate", maxCount: 10 },
    ]),
    submitOnboardingForm
);

// GET my onboarding form - uses searchLimiter (60 per minute)
router.get(
    "/onboarding/me",
    secureRoute,
    searchLimiter,
    getOnboardingForm
);

// PUT update onboarding form with file uploads - uses profileUpdateLimiter (30 per hour)
router.put(
    "/onboarding/update",
    secureRoute,
    profileUpdateLimiter,
    upload.fields([
        { name: "resume", maxCount: 1 },
        { name: "degreeCertificate", maxCount: 1 },
        { name: "project", maxCount: 2 },
        { name: "experienceCertificate", maxCount: 5 },
        { name: "profileImage", maxCount: 1 }, 
        { name: "backgroundImage", maxCount: 1 },
        { name: "leadershipCertificate", maxCount: 10 },
        { name: "internationalExperienceCertificate", maxCount: 10 },
        { name: "awardCertificate", maxCount: 10 },
    ]),
    updateOnboardingForm
);

// GET user onboarding details by userId - uses searchLimiter (60 per minute)
router.get(
    "/onboarding/get-details/:userId",
    secureRoute,
    searchLimiter,
    getOnboardingByUserId
);

// GET master data (dropdown options) - uses searchLimiter (60 per minute)
router.get(
    "/master-data",
    searchLimiter,
    getMasterData
);

// POST add custom master data - uses signupLimiter (5 per hour)
router.post(
    "/master-data",
    secureRoute,
    signupLimiter,
    createMasterData
);

// Commented out - fetch categorized skills
// router.get("/onboarding/categorized-skills", secureRoute, getCategorizedSkills);

export default router;