import express from "express";
import { 
    createHackathon, 
    getHackathons,
    getHackathon,
    updateHackathon,
    deleteHackathon
} from "../controllers/hackathonController.js";
import secureRoute from "../middlewares/secureRouteMiddleware.js";
import {
    searchLimiter,
    applicationLimiter,
    deleteAccountLimiter,
} from "../middlewares/ratelimiter/index.js";

const router = express.Router();

// api '.../hackathon'

// ============================================================
// Hackathon Routes
// ============================================================

// GET all hackathons (Public) - uses searchLimiter (60 per minute)
router.get(
    '/',
    searchLimiter,
    getHackathons
);

// GET hackathon by ID (Public) - uses searchLimiter (60 per minute)
router.get(
    '/:id',
    searchLimiter,
    getHackathon
);

// POST create hackathon - uses applicationLimiter (30 per hour)
router.post(
    '/create',
    secureRoute,
    applicationLimiter,
    createHackathon
);

// PUT update hackathon - uses applicationLimiter (30 per hour)
router.put(
    '/:id',
    secureRoute,
    applicationLimiter,
    updateHackathon
);

// DELETE hackathon - uses deleteAccountLimiter (2 per day)
router.delete(
    '/:id',
    secureRoute,
    deleteAccountLimiter,
    deleteHackathon
);

export default router;