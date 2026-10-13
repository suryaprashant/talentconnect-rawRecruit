import express from 'express';
import { 
  getCompanyWorkshopsWithRegistrations, 
  getWorkshopRegistrations,
  confirmRegistration,
  rejectRegistration,
  getRegistrationDetails,
  sendFileToConfirmedUsers
} from '../../controllers/hostingManagement/workshopHostingController.js';
import secureRoute from '../../middlewares/secureRouteMiddleware.js';
import upload from '../../utils/multer.js';
import {
    searchLimiter,
    adminLimiter,
    documentUploadLimiter,
} from "../../middlewares/ratelimiter/index.js";

const router = express.Router();

// ============================================================
// Workshop Hosting Routes
// ============================================================

// GET all workshops hosted by a company with registration counts - uses searchLimiter (60 per minute)
router.get(
    '/workshops',
    secureRoute,
    searchLimiter,
    getCompanyWorkshopsWithRegistrations
);

// GET all registrations for a specific workshop - uses searchLimiter (60 per minute)
router.get(
    '/workshops/:workshopId/registrations',
    secureRoute,
    searchLimiter,
    getWorkshopRegistrations
);

// GET detailed information about a specific registration - uses searchLimiter (60 per minute)
router.get(
    '/workshops/registrations/:registrationId',
    secureRoute,
    searchLimiter,
    getRegistrationDetails
);

// PUT confirm a registration - uses adminLimiter (300 per minute)
router.put(
    '/workshops/registrations/:registrationId/confirm',
    secureRoute,
    adminLimiter,
    confirmRegistration
);

// PUT reject a registration - uses adminLimiter (300 per minute)
router.put(
    '/workshops/registrations/:registrationId/reject',
    secureRoute,
    adminLimiter,
    rejectRegistration
);

// POST send file to confirmed users - uses documentUploadLimiter (20 per hour)
router.post(
    '/workshops/:workshopId/send-file',
    secureRoute,
    documentUploadLimiter,
    upload.single('file'),
    sendFileToConfirmedUsers
);

export default router;