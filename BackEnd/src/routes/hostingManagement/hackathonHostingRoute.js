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

const router = express.Router();

// Route to get all hackathons hosted by a company with registration counts
router.get('/hackathons', secureRoute, getCompanyHackathonsWithRegistrations);

// Route to get all registrations for a specific hackathon
router.get('/hackathons/:hackathonId/registrations', secureRoute, getHackathonRegistrations);

// Route to get detailed information about a specific registration
router.get('/registrations/:registrationId', secureRoute, getRegistrationDetails);

// Route to confirm a registration
router.put('/registrations/:registrationId/confirm', secureRoute, confirmRegistration);

// Route to reject a registration
router.put('/registrations/:registrationId/reject', secureRoute, rejectRegistration);

// Route to send file to confirmed users
router.post('/hackathons/:hackathonId/send-file', secureRoute, upload.single('file'), sendFileToConfirmedUsers);

export default router;
