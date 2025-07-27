import express from "express";
import { createApplication, createIntershipApplication, createJobListingApplication, getAcceptedCandidatesByCompany, getAcceptedCandidatesByJob, getShortlistedCandidatesByCompany, getOffcampusUserApplication, getJobListingUserApplication } from "../controllers/application.controller.js";
import secureRoute from '../middlewares/secureRoute.js'

const router = express.Router();

// api '.../application'

router.get('/candidate/offCampus', secureRoute, getOffcampusUserApplication);
router.get('/candidate/joblisting', secureRoute, getJobListingUserApplication);

router.post('/offcampusapply', secureRoute, createApplication);
router.get('/offcampus/shortlisted', secureRoute, getShortlistedCandidatesByCompany);
router.get('/offcampus/accepted', secureRoute, getAcceptedCandidatesByCompany);

router.post('/joblistingapply', secureRoute, createJobListingApplication);

// internship
router.post('/internship/apply', secureRoute, createIntershipApplication);

// shortlisting


// access only to company 
// accept oncampus
// router.get('/accept/oncampus/:companyId', getAcceptedCandidatesFromCollege);
// accept offcampus
router.get('/accept/:id', getAcceptedCandidatesByJob);

export default router;