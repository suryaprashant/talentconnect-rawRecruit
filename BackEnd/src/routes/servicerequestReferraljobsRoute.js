import express from "express";
import { createJob } from "src/controllers/servicerequestReferraljobsController.js";

const router = express.Router();

router.post("/jobs", createJob);

export default router;
