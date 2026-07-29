import express from 'express';
import multer from 'multer';
import { getCollegeOnboardingByUserId, submitCollegeOnboarding } from '../../controllers/collegeDashboard/collegeOnboardingController.js';
import secureRoute from '../../middlewares/secureRouteMiddleware.js';
//import  updateCollegeProfile  from '../../controllers/CollegeDashboard/collegeProfileController.js';
import {
  updateCollegeProfile
} from '../../controllers/collegeDashboard/collegeProfileController.js';
import { createCollegeMasterDataController, getCollegeMasterDataByTypeController } from '../../controllers/collegeNameController.js';
import {
    profileUpdateLimiter,
    searchLimiter,
    signupLimiter,
} from "../../middlewares/ratelimiter/index.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ============================================================
// College Onboarding Routes
// ============================================================

// POST submit college onboarding with file uploads - uses profileUpdateLimiter (30 per hour)
router.post(
  '/submit-onboarding',
  secureRoute,
  profileUpdateLimiter,
  upload.fields([
    { name: 'collegeBrochure', maxCount: 1 },
    { name: 'profileImage', maxCount: 1 },
    { name: 'backgroundImage', maxCount: 1 }
  ]),
  submitCollegeOnboarding
);

// PUT update college information with file uploads - uses profileUpdateLimiter (30 per hour)
router.put(
  '/updateInformation',
  secureRoute,
  profileUpdateLimiter,
  upload.fields([
    { name: 'collegeImage', maxCount: 1 },
    { name: 'backgroundImage', maxCount: 1 },
    { name: 'coordinatorImage', maxCount: 1 }
  ]),
  updateCollegeProfile
);

// GET college profile data - uses searchLimiter (60 per minute)
router.get(
  '/profile-data',
  secureRoute,
  searchLimiter,
  getCollegeOnboardingByUserId
);

// POST create college master data - uses signupLimiter (5 per hour)
router.post(
  "/college-master-data",
  signupLimiter,
  createCollegeMasterDataController
);

// GET college master data by type - uses searchLimiter (60 per minute)
router.get(
  "/college-master-data/:type",
  searchLimiter,
  getCollegeMasterDataByTypeController
);

export default router;