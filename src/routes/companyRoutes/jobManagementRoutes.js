/*import express from "express";

import {
  getAllOffCampusApplications,
  shortlistOffCampusCandidate,
  rejectOffCampusCandidate,
  getSingleOffCampusApplication,
} from '../../controllers/Company Dashboard/Job Management/offCampusApplicationController.js';

import {
  getAllPoolCampusApplications,
  shortlistPoolCampusCandidate,
  rejectPoolCampusCandidate,
  getSinglePoolCampusApplication,
} from '../../controllers/company Dashboard/Job Management/poolCampusController.js';

const router = express.Router();


import {
  createOnCampusDrive,
  getOnCampusDrives,
  getOnCampusDriveById,
  updateDriveStatus,
} from "../../controllers/Company Dashboard/Job Management/manageOnCampusController.js";


// POST: Create new On-Campus Drive
router.post("/", createOnCampusDrive);

// GET: Fetch all On-Campus Drives
router.get("/", getOnCampusDrives);

// GET: Get details of a specific Drive
router.get("/:id", getOnCampusDriveById);

// PUT: Update status of a Drive
router.put("/:id/status", updateDriveStatus);



// ------------------ Off-Campus Applications ------------------ //
// Get all Off-Campus applications
router.get('/off-campus-applications', getAllOffCampusApplications);

// Shortlist a candidate
router.put('/off-campus-applications/shortlist/:applicationId', shortlistOffCampusCandidate);

// Reject a candidate
router.put('/off-campus-applications/reject/:applicationId', rejectOffCampusCandidate);

// Get single application details
router.get('/off-campus-applications/:applicationId', getSingleOffCampusApplication);

// ------------------ Pool-Campus Applications ------------------ //
// Get all Pool-Campus applications
router.get('/pool-campus-applications', getAllPoolCampusApplications);

// Shortlist a Pool Campus candidate
router.put('/pool-campus-applications/shortlist/:applicationId', shortlistPoolCampusCandidate);

// Reject a Pool Campus candidate
router.put('/pool-campus-applications/reject/:applicationId', rejectPoolCampusCandidate);

// Get single Pool Campus application details
router.get('/pool-campus-applications/:applicationId', getSinglePoolCampusApplication);

export default router;*/
