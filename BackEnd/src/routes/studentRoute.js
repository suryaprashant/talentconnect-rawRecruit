import express from "express";
import { createStudentOverview } from "../controllers/studentController.js";

const router = express.Router();

// @route   POST /api/student-overview
// @desc    Create a new student profile
// @access  Private
router.post("/studentOverview", createStudentOverview);

export default router;
