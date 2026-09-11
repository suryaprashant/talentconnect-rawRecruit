import express from 'express';
import { 
  getCompanyHackathonsWithRegistrations, 
  getHackathonRegistrations,
  confirmRegistration,
  rejectRegistration,
  getRegistrationDetails,
  sendFileToConfirmedUsers
} from '../../controllers/hostingManagement/hackathonHostingController.js';
import secureRoute from '../../middlewares/secureRouteMiddleware.js';
import upload from '../../utils/multer.js';
import {
    searchLimiter,
    adminLimiter,
    documentUploadLimiter,
} from "../../middlewares/ratelimiter/index.js";

const router = express.Router();

// ============================================================
// Hackathon Hosting Routes
// ============================================================

// GET all hackathons hosted by a company with registration counts - uses searchLimiter (60 per minute)
router.get(
    '/hackathons',
    secureRoute,
    searchLimiter,
    getCompanyHackathonsWithRegistrations
);

// GET all registrations for a specific hackathon - uses searchLimiter (60 per minute)
router.get(
    '/hackathons/:hackathonId/registrations',
    secureRoute,
    searchLimiter,
    getHackathonRegistrations
);

// GET detailed information about a specific registration - uses searchLimiter (60 per minute)
router.get(
    '/hackathons/registrations/:registrationId',
    secureRoute,
    searchLimiter,
    getRegistrationDetails
);

// PUT confirm a registration - uses adminLimiter (300 per minute)
router.put(
    '/hackathons/registrations/:registrationId/confirm',
    secureRoute,
    adminLimiter,
    confirmRegistration
);

// PUT reject a registration - uses adminLimiter (300 per minute)
router.put(
    '/hackathons/registrations/:registrationId/reject',
    secureRoute,
    adminLimiter,
    rejectRegistration
);

// POST send file to confirmed users - uses documentUploadLimiter (20 per hour)
router.post(
    '/hackathons/:hackathonId/send-file',
    secureRoute,
    documentUploadLimiter,
    upload.single('file'),
    sendFileToConfirmedUsers
);

export default router;