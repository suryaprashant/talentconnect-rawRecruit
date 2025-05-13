import express from 'express';
import {
  createOrUpdateCompanyOverview
} from '../../controllers/Company Dashboard/companyOverviewController.js';

import {
  addCompanyProfile,
} from '../../controllers/Company Dashboard/companyProfileController.js'

const router = express.Router();

// Route to create or update basic company overview
router.post('/overview', createOrUpdateCompanyOverview);

// Route to add complete company profile
router.post('/profile', addCompanyProfile);



export default router;
