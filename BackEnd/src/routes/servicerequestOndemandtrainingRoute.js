// routes/onDemandRoutes.js
import express from "express";
import { submitOnDemandTrainingRequest } from "../controllers/servicerequest_ondemandtraining.js";
import { serviceRequestLimiter } from "../middlewares/ratelimiter/index.js";

const router = express.Router();


router.post("/on-demand-training", serviceRequestLimiter, submitOnDemandTrainingRequest);

export default router;