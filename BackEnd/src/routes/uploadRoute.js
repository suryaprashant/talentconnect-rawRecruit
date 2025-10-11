import express from 'express';
import multer from 'multer';
// 1. Import the controller function
import { uploadResume } from '../controllers/resumeController.js';

const router = express.Router();

// Configure multer (this can also be moved to a separate middleware file)
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') cb(null, true);
        else cb(new Error('Only PDF files are allowed'), false);
    }
});

// 2. The route now just points to the controller function
router.post('/resume', upload.single('resume'), uploadResume);

export default router;