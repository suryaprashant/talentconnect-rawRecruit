import express from "express";
import {
  createInternshipJob,
  getAllInternshipJobs,
} from "../controllers/hiringchannels_employeer_postinternship.js";

const router = express.Router();

router.post("/internship/job", createInternshipJob);
router.get("/internship/jobs", getAllInternshipJobs);

export default router;
