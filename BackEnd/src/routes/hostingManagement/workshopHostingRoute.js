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

const router = express.Router();

// Route to get all workshops hosted by a company with registration counts
router.get('/workshops', secureRoute, getCompanyWorkshopsWithRegistrations);

// Route to get all registrations for a specific workshop
router.get('/workshops/:workshopId/registrations', secureRoute, getWorkshopRegistrations);

// Route to get detailed information about a specific registration
router.get('/workshops/registrations/:registrationId', secureRoute, getRegistrationDetails);

// Route to confirm a registration
router.put('/workshops/registrations/:registrationId/confirm', secureRoute, confirmRegistration);

// Route to reject a registration
router.put('/workshops/registrations/:registrationId/reject', secureRoute, rejectRegistration);

// Route to send file to confirmed users
router.post('/workshops/:workshopId/send-file', secureRoute, upload.single('file'), sendFileToConfirmedUsers);

export default router;
