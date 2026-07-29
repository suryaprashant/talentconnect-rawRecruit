import express from "express";
import {
  getAllBlogs,
} from "../controllers/blogController.js";

import {
  adminLimiter,
} from "../middlewares/ratelimiter/index.js";

const router = express.Router();

// ============================================================
// Admin Blog Routes
// ============================================================

// Admin API - uses adminLimiter (300 requests per minute)
router.get(
  "/",
  adminLimiter,
  getAllBlogs
);

export default router;