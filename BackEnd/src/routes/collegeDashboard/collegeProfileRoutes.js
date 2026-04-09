import express from 'express';
import multer from 'multer';
import { createCollegeProfile , updateCollegeProfile, getProfileCompleteness, getStudentsByCollegeId} from '../../controllers/collegeDashboard/collegeProfileController.js'
import secureRoute from '../../middlewares/secureRouteMiddleware.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  '/college-profile',
  upload.fields([
    { name: 'collegeImage', maxCount: 1 },
    { name: 'backgroundImage', maxCount: 1 },
    { name: 'coordinatorImage', maxCount: 1 },
    { name: 'collegeBrochure', maxCount: 1 }
  ]),
  createCollegeProfile
);

router.put(
  '/update-profile', 
  secureRoute, 
  upload.fields([
    { name: 'collegeImage', maxCount: 1 },
    { name: 'backgroundImage', maxCount: 1 },
    { name: 'coordinatorImage', maxCount: 1 }
  ]), 
  updateCollegeProfile
);

router.get('/get-completeness-score',secureRoute,getProfileCompleteness)
router.get('/:collegeId/students',secureRoute,getStudentsByCollegeId)
export default router;

