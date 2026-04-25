import express from 'express';
import multer from 'multer';

import { createCompanyProfile, getCompanyProfile, updateCompanyProfile, getCompanyImageByUserId, getCompanyProfileCompleteness } from '../../controllers/CompanyDashboard/companyProfileController.js';
import secureRoute from '../../middlewares/secureRouteMiddleware.js';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

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
router.get('/getInformation/:userId',secureRoute, getCompanyImageByUserId)
router.get('/getInformation', secureRoute, getCompanyProfile);

router.get('/profile-completeness',secureRoute,getCompanyProfileCompleteness)

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
//router.get("/profile-image/:userId",secureRoute, getCompanyImageByUserId);



export default router;