import express from "express";
import { submitRegistration } from "../controllers/hiringchannels_oncampusregister.js";

const router = express.Router();

// GET /api/applications
router.post("/oncampus-register", submitRegistration);

export default router;
