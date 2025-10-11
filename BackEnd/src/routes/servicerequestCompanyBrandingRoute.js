// routes/servicerequest_company_branding.js
import express from "express";
import { createServiceRequest } from "src/controllers/servicerequestCompanyBrandingController.js";

const router = express.Router();

router.post("/servicerequest-companybranding", createServiceRequest);

export default router;
