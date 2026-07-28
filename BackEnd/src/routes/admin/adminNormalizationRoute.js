import express from "express";

import {
  getPendingNormalizations,
  approveNormalization,
  rejectNormalization,
  createCanonicalEntity,
  mergeCanonicalEntity,
  getAllData
} from "../../controllers/admin/adminNormalizationController.js";
import adminAuth from "../../middlewares/adminMiddleware.js";
import {
    searchLimiter,
    adminLimiter,
    deleteAccountLimiter,
} from "../../middlewares/ratelimiter/index.js";

const router = express.Router();

router.use(adminAuth);

// ============================================================
// Admin Normalization Routes
// ============================================================

// GET pending normalizations - uses searchLimiter (60 per minute)
router.get(
    "/pending",
    searchLimiter,
    getPendingNormalizations
);

// GET all normalization data - uses searchLimiter (60 per minute)
router.get(
    "/all",
    searchLimiter,
    getAllData
);

// PATCH approve normalization - uses adminLimiter (300 per minute)
router.patch(
    "/:id/approve",
    adminLimiter,
    approveNormalization
);

// PATCH reject normalization - uses adminLimiter (300 per minute)
router.patch(
    "/:id/reject",
    adminLimiter,
    rejectNormalization
);

// POST create canonical entity - uses adminLimiter (300 per minute)
router.post(
    "/:id/create",
    adminLimiter,
    createCanonicalEntity
);

// POST merge canonical entity - uses deleteAccountLimiter (2 per day)
router.post(
    "/merge",
    deleteAccountLimiter,
    mergeCanonicalEntity
);

export default router;