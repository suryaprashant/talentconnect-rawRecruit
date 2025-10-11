import express from 'express';
import { deleteJob, getPostedJobs } from 'src/controllers/jobManagementController.js';
import secureRoute from 'src/middlewares/secureRouteMiddleware.js';
import { getCollegePostedJobs } from 'src/controllers/collegeJobManagementController.js';

const router = express.Router();

// api '../company/jobmanagement'

router.delete('/:jobId',secureRoute,deleteJob);
// get jobs
router.get('/:jobType', secureRoute, getPostedJobs);
// router.get('/offcampus/applications/:jobId', secureRoute, getOffcampusJobApplicants);

// get applications
// router.get('offcampus/applications:id')




export default router; 