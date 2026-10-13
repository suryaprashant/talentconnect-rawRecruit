import express from 'express';
import multer from 'multer';
import { createFresherProfile } from '../controllers/fresherProfileController.js';
import secureRoute from '../middlewares/secureRouteMiddleware.js';
import {
    profileUpdateLimiter,
} from "../middlewares/ratelimiter/index.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ============================================================
// Fresher Profile Route (With File Uploads)
// ============================================================

// POST create fresher profile with multiple file uploads - uses profileUpdateLimiter (30 per hour)
router.post(
  '/',
  secureRoute,
  profileUpdateLimiter,
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'backgroundImage', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
    { name: 'degreeCertificate', maxCount: 1 },
  ]),
  createFresherProfile
);

export default router;