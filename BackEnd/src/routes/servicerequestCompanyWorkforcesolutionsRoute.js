import express from "express";
import { createServiceRequest } from "../controllers/servicerequestCompanyWorkforcesolutionsController.js";
import { serviceRequestLimiter } from "../middlewares/ratelimiter/index.js";

const router = express.Router();

router.post("/servicerequest-workforce", serviceRequestLimiter, createServiceRequest);

export default router;