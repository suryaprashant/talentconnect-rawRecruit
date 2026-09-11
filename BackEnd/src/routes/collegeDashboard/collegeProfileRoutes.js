import express from 'express';
import multer from 'multer';
import { createCollegeProfile , updateCollegeProfile, getProfileCompleteness, getStudentsByCollegeId} from '../../controllers/collegeDashboard/collegeProfileController.js'
import secureRoute from '../../middlewares/secureRouteMiddleware.js';
import {
    profileUpdateLimiter,
    searchLimiter,
} from "../../middlewares/ratelimiter/index.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ============================================================
// College Profile Routes
// ============================================================

// POST create college profile with file uploads - uses profileUpdateLimiter (30 per hour)
router.post(
  '/college-profile',
  profileUpdateLimiter,
  upload.fields([
    { name: 'collegeImage', maxCount: 1 },
    { name: 'backgroundImage', maxCount: 1 },
    { name: 'coordinatorImage', maxCount: 1 },
    { name: 'collegeBrochure', maxCount: 1 }
  ]),
  createCollegeProfile
);

// PUT update college profile with file uploads - uses profileUpdateLimiter (30 per hour)
router.put(
  '/update-profile', 
  secureRoute,
  profileUpdateLimiter,
  upload.fields([
    { name: 'collegeImage', maxCount: 1 },
    { name: 'backgroundImage', maxCount: 1 },
    { name: 'coordinatorImage', maxCount: 1 }
  ]), 
  updateCollegeProfile
);

// GET profile completeness score - uses searchLimiter (60 per minute)
router.get(
  '/get-completeness-score',
  secureRoute,
  searchLimiter,
  getProfileCompleteness
);

// GET students by college ID - uses searchLimiter (60 per minute)
router.get(
  '/students',
  secureRoute,
  searchLimiter,
  getStudentsByCollegeId
);

export default router;