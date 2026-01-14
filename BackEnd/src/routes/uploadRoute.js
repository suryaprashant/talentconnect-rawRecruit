import express from 'express';
import multer from 'multer';
import { 
  uploadResume, 
  resumeSearch,
  viewResumeAsPdf,
  serveResume  
} from '../controllers/resumeController.js';
import secureRoute from '../middlewares/secureRouteMiddleware.js';

const router = express.Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Existing routes
router.post('/resume', secureRoute, upload.single('resume'), uploadResume);
router.get('/search', resumeSearch);

router.get('/serve/:userId', serveResume);

router.get('/view-pdf/:userId', viewResumeAsPdf);

export default router;