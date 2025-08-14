import express from 'express';
import { getPostedJobs } from '../controllers/jobManagementController.js';
import secureRoute from '../middlewares/secureRoute.js';

const router = express.Router();

// api '../company/jobmanagement'

// get jobs
router.get('/:jobType', secureRoute, getPostedJobs);
// router.get('/offcampus/applications/:jobId', secureRoute, getOffcampusJobApplicants);

// get applications
// router.get('offcampus/applications:id')

export default router; 