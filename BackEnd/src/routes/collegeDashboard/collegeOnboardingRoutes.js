import express from 'express';
import multer from 'multer';
import { getCollegeOnboardingByUserId, submitCollegeOnboarding } from '../../controllers/collegeDashboard/collegeOnboardingController.js';
import secureRoute from '../../middlewares/secureRouteMiddleware.js';
//import  updateCollegeProfile  from '../../controllers/CollegeDashboard/collegeProfileController.js';
import {
  updateCollegeProfile
} from '../../controllers/collegeDashboard/collegeProfileController.js';
import { createCollegeMasterDataController, getCollegeMasterDataByTypeController } from '../../controllers/collegeNameController.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  '/submit-onboarding',
  secureRoute, // Apply your authentication middleware
  upload.fields([
    { name: 'collegeBrochure', maxCount: 1 },
    { name: 'profileImage', maxCount: 1 },
    { name: 'backgroundImage', maxCount: 1 }
  ]),
  submitCollegeOnboarding
);

router.put(
  '/updateInformation',
  secureRoute,
  upload.fields([
    { name: 'collegeImage', maxCount: 1 },
    { name: 'backgroundImage', maxCount: 1 },
    { name: 'coordinatorImage', maxCount: 1 }
  ]),
  updateCollegeProfile
);


router.get('/profile-data', secureRoute , getCollegeOnboardingByUserId);

router.post("/college-master-data", createCollegeMasterDataController);
router.get("/college-master-data/:type", getCollegeMasterDataByTypeController);

export default router;
