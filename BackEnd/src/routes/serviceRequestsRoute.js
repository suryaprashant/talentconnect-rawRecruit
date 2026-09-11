import express from 'express';

import { createOnCampusPlacementRequest, createOnboardingSupportRequest , PoolCampusRequest, StudentTrainingRequest, CollegeSeminarRequest, createBrandingRequest,createWorkforceRequest, createEmployeeTrainingRequest, createStudentCounsellingRequest, createStudentMockInterviewRequest, createEmployeeTrainingRegistration, createBrandingRegistration, getCompanyServiceRequestStatus, getCollegeServiceRequestStatus, CollegeBrandingRequest } from '../controllers/serviceRequestController.js';
import secureRoute from '../middlewares/secureRouteMiddleware.js';
import {
    serviceRequestLimiter,
    searchLimiter,
    applicationLimiter,
} from "../middlewares/ratelimiter/index.js";

const router = express.Router();

// ============================================================
// Service Request Routes
// ============================================================

// ============================================================
// College Side - Service Requests
// ============================================================

// POST college on-campus placement - uses serviceRequestLimiter (10 per hour)
router.post(
    '/college/On-campus-Placement',
    secureRoute,
    serviceRequestLimiter,
    createOnCampusPlacementRequest
);

// POST college pool-campus - uses serviceRequestLimiter (10 per hour)
router.post(
    '/college/pool-campus',
    secureRoute,
    serviceRequestLimiter,
    PoolCampusRequest
);

// POST college student training - uses serviceRequestLimiter (10 per hour)
router.post(
    '/college/student-training',
    secureRoute,
    serviceRequestLimiter,
    StudentTrainingRequest
);

// POST college seminar - uses serviceRequestLimiter (10 per hour)
router.post(
    '/college-seminar',
    secureRoute,
    serviceRequestLimiter,
    CollegeSeminarRequest
);

// POST college branding - uses serviceRequestLimiter (10 per hour)
router.post(
    '/college/branding',
    secureRoute,
    serviceRequestLimiter,
    CollegeBrandingRequest
);

// GET college service requests status - uses searchLimiter (60 per minute)
router.get(
    '/college/status',
    secureRoute,
    searchLimiter,
    getCollegeServiceRequestStatus
);

// ============================================================
// Company Side - Service Requests
// ============================================================

// POST company workforce recruitment - uses serviceRequestLimiter (10 per hour)
router.post(
    '/company/workforce-recruitment',
    secureRoute,
    serviceRequestLimiter,
    createWorkforceRequest
);

// POST company employee training - uses serviceRequestLimiter (10 per hour)
router.post(
    '/company/employee-training',
    secureRoute,
    serviceRequestLimiter,
    createEmployeeTrainingRequest
);

// POST company branding - uses serviceRequestLimiter (10 per hour)
router.post(
    '/company/branding',
    secureRoute,
    serviceRequestLimiter,
    createBrandingRequest
);

// POST company employee training registration - uses applicationLimiter (30 per hour)
router.post(
    '/company/employee-training-registration',
    secureRoute,
    applicationLimiter,
    createEmployeeTrainingRegistration
);

// POST company branding registration - uses applicationLimiter (30 per hour)
router.post(
    '/company/branding-registration',
    secureRoute,
    applicationLimiter,
    createBrandingRegistration
);

// GET company service requests status - uses searchLimiter (60 per minute)
router.get(
    '/company/status',
    secureRoute,
    searchLimiter,
    getCompanyServiceRequestStatus
);

// ============================================================
// Candidate Side - Service Requests
// ============================================================

// POST student counselling - uses serviceRequestLimiter (10 per hour)
router.post(
    '/student/counselling',
    secureRoute,
    serviceRequestLimiter,
    createStudentCounsellingRequest
);

// POST student mock interview - uses serviceRequestLimiter (10 per hour)
router.post(
    '/student/mock-interview',
    secureRoute,
    serviceRequestLimiter,
    createStudentMockInterviewRequest
);

// POST onboarding support - uses serviceRequestLimiter (10 per hour)
router.post(
    '/onboarding-support',
    serviceRequestLimiter,
    createOnboardingSupportRequest
);

export default router;