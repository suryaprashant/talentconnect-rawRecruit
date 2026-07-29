import express from "express";
import { submitOnDemandTrainingRequest } from "../controllers/servicerequestCompanyEmployeerbrandingController.js";
import { serviceRequestLimiter } from "../middlewares/ratelimiter/index.js";

const router = express.Router();


router.post("/submit-employer-branding", serviceRequestLimiter, submitOnDemandTrainingRequest);

export default router;