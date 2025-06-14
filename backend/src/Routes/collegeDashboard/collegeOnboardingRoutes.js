import express from 'express';
import multer from 'multer';
import { submitCollegeOnboarding } from '../../controllers/collegeDashboard/collegeOnboardingController.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  '/submit-onboarding',
  upload.fields([
    { name: 'collegeBrochure', maxCount: 1 }
  ]),
  submitCollegeOnboarding
);

export default router;
