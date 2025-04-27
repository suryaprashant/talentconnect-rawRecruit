import express from "express";

import { fetchOpportunitiesForCollegeStudent, findRelevantOpportunityById } from "../controllers/relevantJobs.controller.js";
import { createJob, fetchOnCampusOpportunities } from "../controllers/job.controller.js";

const router = express.Router();

// api '.../jobs'

// company
router.post('/', createJob);

// colleges
router.get('/oncampus', fetchOnCampusOpportunities);

// user
// find relevant jobs by user Id
router.get('/campus/', fetchOpportunitiesForCollegeStudent);
router.get('/:id', findRelevantOpportunityById);
// router.get('/campusopportunity', fetchCampusOpportunities);

export default router;