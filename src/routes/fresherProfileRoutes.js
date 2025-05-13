import express from 'express';
import upload from '../utils/multer.js';
import checkFresher from '../middlewares/checkFresher.js';
import { createFresherProfile, updateFresherProfile} from '../controllers/fresherProfileController.js';

const router = express.Router();

router.post(
  '/',
  upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'profileImage', maxCount: 1 },
    { name: 'backgroundImage', maxCount: 1 }
  ]),
  checkFresher,
  createFresherProfile
);

router.put(
  '/',
  upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'profileImage', maxCount: 1 },
    { name: 'backgroundImage', maxCount: 1 }
  ]),
  checkFresher,
  updateFresherProfile
);

export default router;
