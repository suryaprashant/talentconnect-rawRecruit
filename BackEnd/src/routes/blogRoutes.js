import express from "express";
import {
  getAllBlogs,
} from "../controllers/blogController.js";

const router = express.Router();

// Public API
router.get("/", getAllBlogs);

export default router;