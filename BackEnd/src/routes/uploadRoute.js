import express from 'express';
import multer from 'multer';
import { 
  uploadResume, 
  resumeSearch,
  viewResumeAsPdf,
  serveResume,  
  getParsedResume
} from '../controllers/resumeController.js';
import secureRoute from '../middlewares/secureRouteMiddleware.js';
import {
    resumeUploadLimiter,
    searchLimiter,
   
    aiLimiter,  // Added for AI parsing
} from "../middlewares/ratelimiter/index.js";

const router = express.Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

// ============================================================
// Resume Routes
// ============================================================

// POST upload resume - uses resumeUploadLimiter (10 per hour)
router.post(
    '/resume',
    secureRoute,
    resumeUploadLimiter,
    upload.single('resume'),
    uploadResume
);

// GET parsed resume (uses AI) - uses aiLimiter (20 per minute)
router.get(
    '/resume/parsed',
    secureRoute,
    aiLimiter,  // 20 per minute - AI-powered parsing
    getParsedResume
);

// GET search resumes - uses searchLimiter (60 per minute)
router.get(
    '/search',
    secureRoute,  // Added authentication
    searchLimiter,
    resumeSearch
);

// GET serve resume - uses publicLimiter (100 per minute)
router.get(
    '/serve/:userId',
    searchLimiter,
    serveResume
);

// GET view resume as PDF - uses publicLimiter (100 per minute)
router.get(
    '/view-pdf/:userId',
     searchLimiter,
    viewResumeAsPdf
);

export default router;