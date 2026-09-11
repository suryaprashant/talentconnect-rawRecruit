import express from "express";
import { createServiceRequest } from "../controllers/servicereequestCompanyEmployeetrainingController.js";
import { serviceRequestLimiter } from "../middlewares/ratelimiter/index.js";

const router = express.Router();

router.post("/servicerequest-employeetraining", serviceRequestLimiter, createServiceRequest);

export default router;