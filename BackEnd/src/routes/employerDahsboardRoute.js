import express from "express";
import { getRegisteredCampus, getRegisteredCampusDetails } from "../controllers/campusPlacementController.js";
import {
    searchLimiter,
} from "../middlewares/ratelimiter/index.js";

const router = express.Router();

// api '.../company/dashboard'

// ============================================================
// Campus Placement Routes (Read Operations)
// ============================================================

// GET registered campus list - uses searchLimiter (60 per minute)
router.get(
    '/oncampus/registeredcampus',
    searchLimiter,
    getRegisteredCampus
);

// GET registered campus details - uses searchLimiter (60 per minute)
router.get(
    '/oncampus/registeredcampus/:id',
    searchLimiter,
    getRegisteredCampusDetails
);

export default router;