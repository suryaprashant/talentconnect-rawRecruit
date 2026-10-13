import { getCareerInsightsWithHiringScore, getUserRanking } from "../controllers/careerInsightsController.js";
import secureRoute from "../middlewares/secureRouteMiddleware.js"; 
import express from "express";
import {
  searchLimiter,
  aiLimiter,
} from "../middlewares/ratelimiter/index.js";

const router = express.Router();

// ============================================================
// Career Insights Routes
// ============================================================

// GET career insights with latest hiring score - uses searchLimiter (60 requests per minute)
router.get(
  "/",
  secureRoute,
  aiLimiter,
  getCareerInsightsWithHiringScore
);

// GET user ranking - uses searchLimiter (60 requests per minute)
router.get(
  "/ranking",
  secureRoute,
  aiLimiter,
  getUserRanking
);

export default router;