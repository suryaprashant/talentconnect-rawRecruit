import express from "express";
import {
  createJob,
  getAllJobs,
} from "../controllers/hiringchannels_employeer_jobpost.js";

const router = express.Router();

router.post("/job", createJob);
router.get("/jobs", getAllJobs);

export default router;
