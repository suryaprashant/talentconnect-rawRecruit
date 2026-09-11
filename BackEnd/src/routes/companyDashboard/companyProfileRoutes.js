import express from 'express';
import multer from 'multer';

import { createCompanyProfile, getCompanyProfile, updateCompanyProfile, getCompanyImageByUserId, getCompanyProfileCompleteness } from '../../controllers/CompanyDashboard/companyProfileController.js';
import secureRoute from '../../middlewares/secureRouteMiddleware.js';
import {
    profileUpdateLimiter,
    searchLimiter,
} from "../../middlewares/ratelimiter/index.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// ============================================================
// Company Profile Routes
// ============================================================

// POST create company profile with file uploads - uses profileUpdateLimiter (30 per hour)
router.post(
  '/profiles',
  secureRoute,
  profileUpdateLimiter,
  upload.fields([
    { name: 'backgroundImage', maxCount: 1 },
    { name: 'kycDocuments', maxCount: 10 },
    {name : 'profileImage' , maxCount : 1},
  ]),
  createCompanyProfile
);

// GET company image by userId - uses searchLimiter (60 per minute)
router.get(
  '/getInformation/:userId',
  secureRoute,
  searchLimiter,
  getCompanyImageByUserId
);

// GET company profile - uses searchLimiter (60 per minute)
router.get(
  '/getInformation',
  secureRoute,
  searchLimiter,
  getCompanyProfile
);

// GET company profile completeness - uses searchLimiter (60 per minute)
router.get(
  '/profile-completeness',
  secureRoute,
  searchLimiter,
  getCompanyProfileCompleteness
);

// PUT update company profile with file uploads - uses profileUpdateLimiter (30 per hour)
router.put(
  '/updateInformation', 
  secureRoute,
  profileUpdateLimiter,
  upload.fields([
    { name: 'backgroundImage', maxCount: 1 },
    { name: 'kycDocuments', maxCount: 10 },
    { name: 'profileImage', maxCount: 1 }
  ]),
  updateCompanyProfile
);

// Commented out route
// router.get("/profile-image/:userId",secureRoute, getCompanyImageByUserId);

export default router;