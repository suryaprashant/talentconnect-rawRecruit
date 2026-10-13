import express from 'express';
import { createCollegeMasterDataController, getAllColleges, getCollegeMasterDataByTypeController, registerCollege } from '../controllers/collegeNameController.js';
import {
    searchLimiter,
    signupLimiter,
} from "../middlewares/ratelimiter/index.js";

const router = express.Router();

// ============================================================
// College Routes
// ============================================================

// GET all colleges - uses searchLimiter (60 per minute)
router.get(
    '/all',
    searchLimiter,
    getAllColleges
);

// POST register college - uses signupLimiter (5 per hour)
router.post(
    '/register',
    signupLimiter,
    registerCollege
);

// Commented out routes - uncomment if needed
// POST create college master data
// router.post(
//     "/college-master-data",
//     signupLimiter,
//     createCollegeMasterDataController
// );

// GET college master data by type
// router.get(
//     "/college-master-data/:type",
//     searchLimiter,
//     getCollegeMasterDataByTypeController
// );

export default router;