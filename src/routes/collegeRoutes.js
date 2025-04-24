import express from 'express';
import {
  createOrUpdateCollegeOverview
} from "../controllers/collegeOverviewController.js"
import { createOrUpdateCollegeProfile } from '../controllers/collegeProfileController.js';


const router = express.Router();

router.post('/overview', createOrUpdateCollegeOverview);

router.post('/profile', createOrUpdateCollegeProfile);

export default router;
