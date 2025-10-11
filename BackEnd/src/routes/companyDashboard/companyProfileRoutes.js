import express from 'express';
import multer from 'multer';
import { createCompanyProfile, getCompanyProfile, updateCompanyProfile } from 'src/controllers/CompanyDashboard/companyProfileController.js';
import secureRoute from 'src/middlewares/secureRouteMiddleware.js';

const router = express.Router();
const upload = multer();

// Routes for company profile creation (form-data upload)
router.post(
  '/profiles', secureRoute ,
  upload.fields([
    { name: 'backgroundImage', maxCount: 1 },
    { name: 'kycDocuments', maxCount: 10 },
    {name : 'profileImage' , maxCount : 1},
  ]),
  createCompanyProfile
);
router.get('/getInformation', secureRoute, getCompanyProfile);

router.put(
  '/updateInformation', 
  secureRoute,
  upload.fields([
    { name: 'backgroundImage', maxCount: 1 },
    { name: 'kycDocuments', maxCount: 10 },
    { name: 'profileImage', maxCount: 1 }
  ]),
  updateCompanyProfile
);

export default router;