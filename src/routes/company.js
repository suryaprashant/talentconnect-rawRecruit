import express from 'express';
import { createCompanyProfile, updateCompanyProfile, uploadDocuments } from '../controllers/company/companyController.js';
import upload from '../middlewares/upload.js'; // Multer middleware for file handling

const router = express.Router();

// Route to create a new company profile
router.post('/create', createCompanyProfile);

// Route to update company profile
router.put('/update/:companyId', updateCompanyProfile);

// Route to upload documents for a company
router.post('/upload-documents', upload.single('document'), uploadDocuments); // 'document' is the key for the file in form-data

export default router;
