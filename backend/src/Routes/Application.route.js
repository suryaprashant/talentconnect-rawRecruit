import express from "express";
import { createApplication, createIntershipApplication, getAcceptedCandidatesByCompany, getAcceptedCandidatesByJob, getShortlistedCandidatesByCompany, getUserApplication } from "../controllers/application.controller.js";
import secureRoute from '../middlewares/secureRoute.js'

const router = express.Router();

// api '.../application'

router.get('/', getUserApplication);
router.post('/offcampusapply', secureRoute, createApplication);
router.get('/offcampus', secureRoute, getUserApplication);
router.get('/offcampus/shortlisted', secureRoute, getShortlistedCandidatesByCompany);
router.get('/offcampus/accepted', secureRoute, getAcceptedCandidatesByCompany);

// internship
router.post('/internship/apply', secureRoute, createIntershipApplication);

// shortlisting


// access only to company 
// accept oncampus
// router.get('/accept/oncampus/:companyId', getAcceptedCandidatesFromCollege);
// accept offcampus
router.get('/accept/:id', getAcceptedCandidatesByJob);

export default router;