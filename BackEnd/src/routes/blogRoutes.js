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

router.get("/", adminLimiter, getAllBlogs);
router.get("/saved", adminLimiter, secureRoute, getSavedBlogs);
router.get("/:blogId", adminLimiter, getBlogById);
router.post("/:blogId/like", adminLimiter, secureRoute, toggleLike);
router.post("/:blogId/save", adminLimiter, secureRoute, toggleSave);
router.get("/:blogId/reaction", adminLimiter, secureRoute, getReaction);

export default router;
