import express from 'express';
import multer from 'multer';
import { createEmployerOnboarding, getEmployerOnboarding, updateEmployerOnboarding, uploadSingleImage } from '../../controllers/employerDashboard/employerProfileController.js';
import secureRoute from '../../middlewares/secureRouteMiddleware.js';
import {
    profileUpdateLimiter,
    searchLimiter,
    imageUploadLimiter,
} from "../../middlewares/ratelimiter/index.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Expected form fields with file
const fileFields = upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'backgroundImage', maxCount: 1 }
]);

// ============================================================
// Employer Onboarding Routes
// ============================================================

// POST create employer onboarding with file uploads - uses profileUpdateLimiter (30 per hour)
router.post(
    '/employerOnboarding',
    secureRoute,
    profileUpdateLimiter,
    fileFields,
    createEmployerOnboarding
);

// GET employer onboarding data - uses searchLimiter (60 per minute)
router.get(
    '/employer-data',
    secureRoute,
    searchLimiter,
    getEmployerOnboarding
);

// PUT update employer onboarding with file uploads - uses profileUpdateLimiter (30 per hour)
router.put(
    '/update-employer',
    secureRoute,
    profileUpdateLimiter,
    fileFields,
    updateEmployerOnboarding
);

// POST upload single image - uses imageUploadLimiter (20 per hour)
router.post(
    '/upload-single-image',
    secureRoute,
    imageUploadLimiter,
    upload.single('image'),
    uploadSingleImage
);

export default router;