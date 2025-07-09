import express from 'express';
import { getOffcampusJobs, getOffcampusJobApplicants } from '../controllers/jobManagementController.js';

const router = express.Router();

// api '../company/jobmanagement'

// get jobs
// offcampus
router.get('/offcampus', getOffcampusJobs);
router.get('/offcampus/applications/:jobId', getOffcampusJobApplicants);

// get applications
// router.get('offcampus/applications:id')

export default router; 