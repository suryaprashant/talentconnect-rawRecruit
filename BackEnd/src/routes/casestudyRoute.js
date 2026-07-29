import express from "express";
import { 
    createCasestudy, 
    getCasestudies,
    getCasestudy,
    updateCasestudy,
    deleteCasestudy
} from "../controllers/casestudyController.js";
import secureRoute from "../middlewares/secureRouteMiddleware.js";
import upload from "../utils/multer.js";
import {
    searchLimiter,
    adminLimiter,
    documentUploadLimiter,
} from "../middlewares/ratelimiter/index.js";

const router = express.Router();

// ============================================================
// Case Study Routes
// ============================================================

// Public GET routes - uses searchLimiter (60 requests per minute)
router.get(
    '/',
    searchLimiter,
    getCasestudies
);

router.get(
    '/:id',
    searchLimiter,
    getCasestudy
);

// POST create case study with file upload - uses documentUploadLimiter (20 per hour)
router.post(
    '/create',
    secureRoute,
    documentUploadLimiter,
    upload.single('file'),
    createCasestudy
);

// PUT update case study with file upload - uses documentUploadLimiter (20 per hour)
router.put(
    '/:id',
    secureRoute,
    documentUploadLimiter,
    upload.single('file'),
    updateCasestudy
);

// DELETE case study - uses adminLimiter (300 per minute)
router.delete(
    '/:id',
    secureRoute,
    adminLimiter,
    deleteCasestudy
);

export default router;