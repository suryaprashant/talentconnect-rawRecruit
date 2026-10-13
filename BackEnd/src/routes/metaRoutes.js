import express from 'express'
const router = express.Router();
import * as metaController from '../controllers/metaController.js';
import secureRoute from '../middlewares/secureRouteMiddleware.js';
import {
    searchLimiter,
    adminLimiter,
} from "../middlewares/ratelimiter/index.js";

// ============================================================
// Meta Routes (Job Metadata)
// ============================================================

// GET /api/meta - uses searchLimiter (60 per minute)
router.get(
    '/',
    searchLimiter,
    metaController.getJobMetadata
);

// POST /api/meta/add - uses adminLimiter (300 per minute)
router.post(
    '/add',
    secureRoute,  // Added authentication
    adminLimiter,
    metaController.addMetadata
);

export default router;