import express from "express";
import { submitOnDemandTrainingRequest } from "../controllers/servicerequestCompanyEmployeerbrandingController.js";

const router = express.Router();

// POST route to submit on-demand training request
router.post("/submit-employer-branding", submitOnDemandTrainingRequest);

export default router;
