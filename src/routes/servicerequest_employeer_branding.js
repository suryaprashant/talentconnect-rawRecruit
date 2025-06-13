// routes/employeeBrandingRequestRoutes.js
import express from "express";
import { submitEmployeeBrandingRequest } from "../controllers/servicerequest_employeer_brandingrequest.js";

const router = express.Router();

router.post("/submit-employee-branding-request", submitEmployeeBrandingRequest);

export default router;
