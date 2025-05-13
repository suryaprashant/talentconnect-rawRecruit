import express from 'express';
import upload from '../utils/multer.js';
import checkProfessional from '../middlewares/checkProfessional.js';
import {
  createOrUpdateProfessionalProfile
} from '../controllers/professionalProfileController.js';

const router = express.Router();

router.post(
  '/',
  upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'profileImage', maxCount: 1 },
    { name: 'backgroundImage', maxCount: 1 },
    { name: 'degreeCertificate', maxCount: 1 },
    { name: 'workExperienceCertificates', maxCount: 10 },
    { name: 'internationalExperienceCertificates', maxCount: 10 },
    { name: 'leadershipCertificates', maxCount: 10 },
  ]),
  checkProfessional,
  createOrUpdateProfessionalProfile
);



export default router;
