import express from "express";

import {
  getAllBlogs,
  getBlogById,
  getSavedBlogs,
} from "../controllers/blogController.js";

import {
  toggleLike,
  toggleSave,
  getReaction,
} from "../controllers/blogReactionController.js";

import { adminLimiter } from "../middlewares/ratelimiter/index.js";

import secureRoute from "../middlewares/secureRouteMiddleware.js";

const router = express.Router();

// Get all blogs
router.get("/", adminLimiter, getAllBlogs);

// Saved blogs (MUST BE BEFORE :blogId)
router.get("/saved", adminLimiter, secureRoute, getSavedBlogs);

// Single blog by id
router.get("/:blogId", adminLimiter, getBlogById);

// Like
router.post("/:blogId/like", adminLimiter, secureRoute, toggleLike);

// Save
router.post("/:blogId/save", adminLimiter, secureRoute, toggleSave);

// Reaction
router.get("/:blogId/reaction", adminLimiter, secureRoute, getReaction);

export default router;
