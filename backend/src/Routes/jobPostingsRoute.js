import express from 'express' ;

import { createOffCampusJobPosting, createOnCampusPosting, createPoolCampusPosting , createJobPosting, createInternshipPosting } from '../controllers/jobPostingController.js';

import secureRoute from '../middlewares/secureRoute.js' ;

const router = express.Router() ;

router.post("/off-campus", secureRoute , createOffCampusJobPosting); 

router.post("/on-campus", secureRoute , createOnCampusPosting); 

router.post("/pool-campus", secureRoute , createPoolCampusPosting);

router.post("/job-posting", secureRoute , createJobPosting);

router.post("/internship-posting", secureRoute , createInternshipPosting);

export default router;
