import express from 'express';
import { deleteJob, getEmployerJobs, getPostedJobs, getReferralApplicationsForProfessional } from '../controllers/jobManagementController.js';
import secureRoute from '../middlewares/secureRouteMiddleware.js';
// import { getCollegePostedJobs } from '../controllers/collegeJobManagementController.js';

const router = express.Router();

// api '../company/jobmanagement'

router.delete('/:jobId',secureRoute,deleteJob);
// get jobs
router.get('/', secureRoute, getPostedJobs);


router.get('/employer/:jobType', secureRoute, getEmployerJobs);
// router.get('/offcampus/applications/:jobId', secureRoute, getOffcampusJobApplicants);
// routes/professional/referralApplicationsRoute.js
router.get(
  "/professional/referral-applications",
  secureRoute,              // ensures logged-in
  getReferralApplicationsForProfessional
);


// get applications
// router.get('offcampus/applications:id')

export default router; 