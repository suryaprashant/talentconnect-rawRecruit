import express from 'express';
import { uploadAndSendFile } from '../../controllers/hostingManagement/fileUploadController.js';
import { uploadDocument } from '../../utils/fileUpload.js';
import secureRoute from '../../middlewares/secureRouteMiddleware.js';
import {
    documentUploadLimiter,
} from "../../middlewares/ratelimiter/index.js";

const router = express.Router();

// ============================================================
// File Upload Route
// ============================================================

// POST upload file - uses documentUploadLimiter (20 per hour)
router.post(
    '/upload-file',
    secureRoute,
    documentUploadLimiter,
    uploadDocument.single('file'),
    uploadAndSendFile
);

export default router;