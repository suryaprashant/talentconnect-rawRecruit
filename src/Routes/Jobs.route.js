import express from "express";

import { findRelevantOpportunityById } from "../controllers/relevantJobs.controller.js";
import { createJob } from "../controllers/job.controller.js";

const router = express.Router();

// api '.../jobs'

// find relevant jobs by profile Id
router.get('/:id', findRelevantOpportunityById);
// router.post('/',createJob);

export default router;