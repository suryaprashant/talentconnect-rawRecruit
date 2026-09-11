import express from "express";
import {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
  duplicateJob,
  getJobDetails,
} from "../controllers/manageOnCampusController.js";

import {
  searchLimiter,
  applicationLimiter,
  deleteAccountLimiter,
} from "../middlewares/ratelimiter/index.js";

const router = express.Router();

// ============================================================
// Manage On-Campus Job Routes
// ============================================================

// POST: Create a job - uses applicationLimiter (30 per hour)
router.post(
  "/",

  applicationLimiter,
  createJob,
);

// GET: Fetch all jobs with optional search, filter, pagination - uses searchLimiter (60 per minute)
router.get(
  "/",

  searchLimiter,
  getJobs,
);

// GET: Get a single job's details - uses searchLimiter (60 per minute)
router.get(
  "/:jobId",

  searchLimiter,
  getJobDetails,
);

// PUT: Update a job - uses applicationLimiter (30 per hour)
router.put(
  "/:jobId",

  applicationLimiter,
  updateJob,
);

// DELETE: Delete a job - uses deleteAccountLimiter (2 per day)
router.delete(
  "/:jobId",

  deleteAccountLimiter,
  deleteJob,
);

// POST: Duplicate a job - uses applicationLimiter (30 per hour)
router.post(
  "/duplicate/:jobId",

  applicationLimiter,
  duplicateJob,
);

export default router;
