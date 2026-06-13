import express from 'express';
import { uploadAndSendFile } from '../../controllers/hostingManagement/fileUploadController.js';
import { uploadDocument } from '../../utils/fileUpload.js';
import secureRoute from '../../middlewares/secureRouteMiddleware.js';

const router = express.Router();

// Route to upload file
router.post('/upload-file', secureRoute, uploadDocument.single('file'), uploadAndSendFile);

export default router;
