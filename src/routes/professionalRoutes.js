// src/routes/professionalRoutes.js

import express from 'express';
import { createProfessionalOverview, updateProfessionalOverview, getProfessionalOverview } from '../controllers/professionalOverviewController.js';
import {
    createProfessionalProfile,
    getProfessionalProfile,
    updateProfessionalProfile,
  } from '../controllers/professionalProfileController.js';

  import {
    addProfessionalResume,
    updateProfessionalResume,
    getProfessionalResume,
  } from '../controllers/professionalResumeController.js';
const router = express.Router();

// Route to create professional overview
router.post('/', createProfessionalOverview);

// Route to update professional overview by email
router.put('/:email', updateProfessionalOverview);

// Route to get professional overview by email
router.get('/:email', getProfessionalOverview);

//profile
router.post('/profile', createProfessionalProfile);
router.get('/profile/:email', getProfessionalProfile);
router.put('/profile/:email', updateProfessionalProfile);


//resume
router.post('/resume', addProfessionalResume);
router.put('/resume/:email', updateProfessionalResume);
router.get('/resume/:email', getProfessionalResume);
export default router;
