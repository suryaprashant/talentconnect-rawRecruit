import express from 'express';
import { deleteJob, getEmployerJobs, getPostedJobs, getReferralApplicationsForProfessional ,deleteReferralJob} from '../controllers/jobManagementController.js';
import secureRoute from '../middlewares/secureRouteMiddleware.js';
// import { getCollegePostedJobs } from '../controllers/collegeJobManagementController.js';
import { reactivateJob } from "../controllers/jobReactivateController.js";

// PATCH /company/jobmanagement/reactivate/:jobId
const router = express.Router();


// api '../company/jobmanagement'

router.delete('/:jobId',secureRoute,deleteJob);
router.patch('/referral/:jobId', secureRoute, deleteReferralJob);
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

router.patch('/reactivate/:jobId', secureRoute, reactivateJob);
// get applications
// router.get('offcampus/applications:id')

export default router; 