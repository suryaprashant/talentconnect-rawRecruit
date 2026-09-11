import express from "express";
import { fetchInternshipOpportunities, findOpportunityById } from "../controllers/jobController.js";
import secureRoute from "../middlewares/secureRouteMiddleware.js";
import {
    searchLimiter,
} from "../middlewares/ratelimiter/index.js";

const router = express.Router();

// api '.../internship'

// ============================================================
// Internship Opportunity Routes
// ============================================================

// GET all internship opportunities - uses searchLimiter (60 per minute)
router.get(
    '/',
    secureRoute,
    searchLimiter,
    fetchInternshipOpportunities
);

// GET internship opportunity by ID - uses searchLimiter (60 per minute)
router.get(
    '/getInternshipDetail/:jobId',
    searchLimiter,
    findOpportunityById
);

export default router;