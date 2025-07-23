import express from 'express';
import { getOffcampusJobs, getOffcampusJobApplicants } from '../controllers/jobManagementController.js';
import secureRoute from '../middlewares/secureRoute.js';

const router = express.Router();

// api '../company/jobmanagement'

// get jobs
// offcampus
router.get('/offcampus', secureRoute, getOffcampusJobs);
router.get('/offcampus/applications/:jobId', secureRoute, getOffcampusJobApplicants);

// get applications
// router.get('offcampus/applications:id')

export default router; 