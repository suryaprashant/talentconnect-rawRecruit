import express from 'express';
import { 
  getCompanyCasestudiesWithRegistrations, 
  getCasestudyRegistrations,
  confirmCasestudyRegistration,
  rejectCasestudyRegistration,
  getCasestudyRegistrationDetails,
  sendFileToConfirmedUsers
} from '../../controllers/hostingManagement/casestudyHostingController.js';
import secureRoute from '../../middlewares/secureRouteMiddleware.js';
import upload from '../../utils/multer.js';
import {
    searchLimiter,
    adminLimiter,
    documentUploadLimiter,
} from "../../middlewares/ratelimiter/index.js";

const router = express.Router();

// ============================================================
// Case Study Hosting Routes
// ============================================================

// GET all case studies hosted by a company with registration counts - uses searchLimiter (60 per minute)
router.get(
    '/casestudies',
    secureRoute,
    searchLimiter,
    getCompanyCasestudiesWithRegistrations
);

// GET all registrations for a specific case study - uses searchLimiter (60 per minute)
router.get(
    '/casestudies/:casestudyId/registrations',
    secureRoute,
    searchLimiter,
    getCasestudyRegistrations
);

// GET detailed information about a specific registration - uses searchLimiter (60 per minute)
router.get(
    '/casestudies/registrations/:registrationId',
    secureRoute,
    searchLimiter,
    getCasestudyRegistrationDetails
);

// PUT confirm a registration - uses adminLimiter (300 per minute)
router.put(
    '/casestudies/registrations/:registrationId/confirm',
    secureRoute,
    adminLimiter,
    confirmCasestudyRegistration
);

// PUT reject a registration - uses adminLimiter (300 per minute)
router.put(
    '/casestudies/registrations/:registrationId/reject',
    secureRoute,
    adminLimiter,
    rejectCasestudyRegistration
);

// POST send file to confirmed users - uses documentUploadLimiter (20 per hour)
router.post(
    '/casestudies/:casestudyId/send-file',
    secureRoute,
    documentUploadLimiter,
    upload.single('file'),
    sendFileToConfirmedUsers
);

export default router;