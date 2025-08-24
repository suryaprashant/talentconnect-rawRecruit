import express from "express";
import { createOffcampusApplication, createIntershipApplication, createJobListingApplication, saveJobByUser, getApplicationsByJob, getCollegeApplicationsByJob, createOncampusApplication, createPoolcampusApplication, shortlistApplicant, acceptApplicant, rejectApplicant } from "../controllers/application.controller.js";
import secureRoute from '../middlewares/secureRoute.js';

const router = express.Router();

// api '.../application'
router.post("/candidate/saveopportunity", secureRoute, saveJobByUser);

// offcampus
router.post('/candidate/offcampus', secureRoute, createOffcampusApplication);
// router.get('/candidate/offCampus', secureRoute, getOffcampusUserApplication);
// router.get('/offcampus/shortlisted', secureRoute, getShortlistedCandidatesByCompany);
// router.get('/offcampus/accepted', secureRoute, getAcceptedCandidatesByCompany);

// joblisting
router.post('/candidate/joblisting', secureRoute, createJobListingApplication);
// router.get('/candidate/joblisting', secureRoute, getJobListingUserApplication);

// internship
router.post('/candidate/internship', secureRoute, createIntershipApplication);
// router.get('/candidate/internship', secureRoute, getInternshipUserApplication);

// oncampus
router.post('/college/oncampus', secureRoute, createOncampusApplication);

// poolcampus
router.post('/college/poolcampus', secureRoute, createPoolcampusApplication);

// shortlisting
router.patch('/manage/shortlist/:applicationId', secureRoute, shortlistApplicant);
router.patch('/manage/reject/:applicationId', secureRoute, rejectApplicant);
router.patch('/manage/accept/:applicationId', secureRoute, acceptApplicant);

// access only to company 

// get candidates by job
router.get('/manage', getApplicationsByJob);

// get college by job
router.get('/manage/college', getCollegeApplicationsByJob);

// accept offcampus
// router.get('/accept/:id', getAcceptedCandidatesByJob);

export default router;