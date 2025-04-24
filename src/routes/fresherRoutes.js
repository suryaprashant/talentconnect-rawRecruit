// src/routes/fresherRoutes.js

import express from 'express';
import {
  addFresherOverview,
  getFresherOverviewByEmail,
  updateFresherOverview,
} from '../controllers/fresherOverviewController.js';

import {
  createFresherProfile,
  getFresherProfileByEmail,
  updateFresherProfile,
} from '../controllers/fresherProfileController.js';

import { addFresherResume, updateFresherResume, getFresherResume } from '../controllers/fresherResumeController.js';

const router = express.Router();

// Fresher Overview routes
router.post('/overview', addFresherOverview);
router.get('/overview/:email', getFresherOverviewByEmail);
router.put('/overview/:email', updateFresherOverview);

//Profile
router.post('/', createFresherProfile);
router.get('/:email', getFresherProfileByEmail);
router.put('/:email', updateFresherProfile);

//resume
router.post('/resume', addFresherResume);
router.put('/resume/:email', updateFresherResume);
router.get('/resume/:email', getFresherResume);

export default router;
