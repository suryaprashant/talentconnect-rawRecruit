// src/routes/studentRoutes.js
import express from 'express';
import {
  createStudentOverview,
  getStudentOverviewByEmail,
  updateStudentOverviewByEmail,
} from '../controllers/studentOverviewController.js';

import {
  addStudentProfile,
  getStudentProfileByEmail,
  updateStudentProfileByEmail,
} from '../controllers/studentProfileController.js';
import { upload } from '../middlewares/multer.js';

import {
  addStudentResume,
  updateStudentResume,
  getStudentResume,
} from '../controllers/studentResumeController.js';


const router = express.Router();

// Create student overview
router.post(
  '/overview',
  upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
  ]),
  createStudentOverview
);

// Get student by email
router.get('/overview/email/:email', getStudentOverviewByEmail);

// Update student by email
router.put(
  '/overview/email/:email',
  upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
  ]),
  updateStudentOverviewByEmail
);

//profile section for student
router.post('/profile', addStudentProfile);
router.get('/profile/:email', getStudentProfileByEmail);
router.put('/profile/:email', updateStudentProfileByEmail);

//resume upload
router.post('/resume', addStudentResume); // Add resume
router.put('/resume/:email', updateStudentResume); // Update resume
router.get('/resume/:email', getStudentResume); // Get resume

export default router;
