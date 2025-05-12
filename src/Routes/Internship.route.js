import express from "express";
import { fetchInternshipOpportunities } from "../controllers/job.controller.js";

const router = express.Router();

// api '.../internship'
router.get('/',fetchInternshipOpportunities);

export default router;