import express from "express";
import { createOffcampusApplication, createIntershipApplication, createJobListingApplication, getAcceptedCandidatesByCompany, getAcceptedCandidatesByJob, getShortlistedCandidatesByCompany, getOffcampusUserApplication, getJobListingUserApplication, getInternshipUserApplication } from "../controllers/application.controller.js";
import secureRoute from '../middlewares/secureRoute.js';

const router = express.Router();

// api '.../application'

// offcampus
router.post('candidate/offcampus', secureRoute, createOffcampusApplication);
router.get('/candidate/offCampus', secureRoute, getOffcampusUserApplication);
router.get('/offcampus/shortlisted', secureRoute, getShortlistedCandidatesByCompany);
router.get('/offcampus/accepted', secureRoute, getAcceptedCandidatesByCompany);

// joblisting
router.post('candidate/joblisting', secureRoute, createJobListingApplication);
router.get('/candidate/joblisting', secureRoute, getJobListingUserApplication);

// internship
router.post('candidate/internship', secureRoute, createIntershipApplication);
router.get('/candidate/internship', secureRoute, getInternshipUserApplication);

// shortlisting

// access only to company 
// accept oncampus
// router.get('/accept/oncampus/:companyId', getAcceptedCandidatesFromCollege);
// accept offcampus
router.get('/accept/:id', getAcceptedCandidatesByJob);

export default router;