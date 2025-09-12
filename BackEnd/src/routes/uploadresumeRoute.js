import express from "express";

import { uploadResume } from "../controllers/uploadResumeController.js";

const router = express.Router();
router.post("/upload-resume", uploadResume);

export default router;
