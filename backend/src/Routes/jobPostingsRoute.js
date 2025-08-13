import express from 'express' ;

import { createOffCampusJobPosting, createOnCampusPosting, createPoolCampusPosting , createJobPosting, createInternshipPosting, createOnCampusCollegeRequest, createPoolCampusCollegeRequest } from '../controllers/jobPostingController.js';

import secureRoute from '../middlewares/secureRoute.js' ;

const router = express.Router() ;

router.post("/off-campus", secureRoute , createOffCampusJobPosting); 

router.post("/on-campus", secureRoute , createOnCampusPosting); 

router.post("/pool-campus", secureRoute , createPoolCampusPosting);

router.post("/job-posting", secureRoute , createJobPosting);

router.post("/internship-posting", secureRoute , createInternshipPosting);

router.post("/on-campus/college-request", secureRoute , createOnCampusCollegeRequest); // Add route for college request

router.post("/pool-campus/college-request", secureRoute , createPoolCampusCollegeRequest); // Add route for college request

export default router;
