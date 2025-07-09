import express from "express";

import { fetchOpportunitiesForCollegeStudent, findRelevantOpportunityById } from "../controllers/relevantJobs.controller.js";
import { createJob, fetchOnCampusOpportunities, findOpportunityById } from "../controllers/job.controller.js";
import secureRoute from "../middlewares/secureRoute.js";

const router = express.Router();

// api '.../jobs'

// company
router.post('/:companyId', createJob);

// colleges
router.get('/oncampus', fetchOnCampusOpportunities);

// user
// find jobs to collegeStudents
router.get('/campus/:collegeId', fetchOpportunitiesForCollegeStudent);
// professional
// router.get('/professional');

router.get('/relevantjobs',secureRoute, findRelevantOpportunityById);
router.get('/jobDetails/:jobId', findOpportunityById);
// router.get('/campusopportunity', fetchCampusOpportunities);


export default router;