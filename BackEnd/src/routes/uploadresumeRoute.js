import express from "express";
import { uploadResume } from "../controllers/uploadResumeController.js";
import secureRoute from "../middlewares/secureRouteMiddleware.js";
import {
    resumeUploadLimiter,
} from "../middlewares/ratelimiter/index.js";

const router = express.Router();

// ============================================================
// Upload Resume Route
// ============================================================

// POST upload resume - uses resumeUploadLimiter (10 per hour)
router.post(
    "/upload-resume",
    secureRoute,
    resumeUploadLimiter,
    uploadResume
);

export default router;