import express from 'express';
import multer from 'multer';
import { createCompanyProfile } from '../../controllers/CompanyDashboard/companyProfileController.js';

const router = express.Router();
const upload = multer();

// Routes for company profile creation (form-data upload)
router.post(
  '/profile',
  upload.fields([
    { name: 'backgroundImage', maxCount: 1 },
    { name: 'kycDocuments', maxCount: 10 }
  ]),
  createCompanyProfile
);

export default router;
