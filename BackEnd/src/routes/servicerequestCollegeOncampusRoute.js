// routes/placementRoutes.js
import express from "express";
import { registerCampusPlacement } from "../controllers/campusPlacementController.js";

import {
    applicationLimiter,
} from "../middlewares/ratelimiter/index.js";

const router = express.Router();

// ============================================================
// Campus Placement Registration Route
// ============================================================

// POST /api/placements/registeroncampus - uses applicationLimiter (30 per hour)
router.post(
    "/registeroncampus",
    
    applicationLimiter,
    registerCampusPlacement
);

export default router;