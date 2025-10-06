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

const router = express.Router();

// Route to get all case studies hosted by a company with registration counts
router.get('/casestudies', secureRoute, getCompanyCasestudiesWithRegistrations);

// Route to get all registrations for a specific case study
router.get('/casestudies/:casestudyId/registrations', secureRoute, getCasestudyRegistrations);

// Route to get detailed information about a specific registration
router.get('/registrations/:registrationId', secureRoute, getCasestudyRegistrationDetails);

// Route to confirm a registration
router.put('/registrations/:registrationId/confirm', secureRoute, confirmCasestudyRegistration);

// Route to reject a registration
router.put('/registrations/:registrationId/reject', secureRoute, rejectCasestudyRegistration);

// Route to send file to confirmed users
router.post('/casestudies/:casestudyId/send-file', secureRoute, upload.single('file'), sendFileToConfirmedUsers);

export default router;
