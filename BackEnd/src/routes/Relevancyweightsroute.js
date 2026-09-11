import express from "express";
import {
  getRelevancyWeights,
  updateRelevancyWeights,
} from "../controllers/Relevancyweightscontroller.js";
import adminAuth from "../../middlewares/adminMiddleware.js";
import { adminLimiter } from "../../middleware/rate-limiter/index.js";

const router = express.Router();

/**
 * GET  /api/admin/relevancy-weights   — fetch current weights
 * PATCH /api/admin/relevancy-weights  — update weights (admin only)
 */
router.get("/relevancy-weights", adminLimiter, adminAuth, getRelevancyWeights);
router.patch("/relevancy-weights", adminLimiter, adminAuth, updateRelevancyWeights);

export default router;