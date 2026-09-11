// routes/servicerequest_company_branding.js
import express from "express";
import { createServiceRequest } from "../controllers/servicerequestCompanyBrandingController.js";
import { serviceRequestLimiter } from "../middlewares/ratelimiter/index.js";

const router = express.Router();


router.post("/servicerequest-companybranding", serviceRequestLimiter, createServiceRequest);

export default router;