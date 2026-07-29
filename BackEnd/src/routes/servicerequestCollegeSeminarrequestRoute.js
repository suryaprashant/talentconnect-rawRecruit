import express from "express";
import { submitRequest } from "../controllers/servicerequest_college_seminarrequest.js";
import {
    serviceRequestLimiter,
} from "../middlewares/ratelimiter/index.js";

const router = express.Router();

// ============================================================
// Service Request College Seminar Route
// ============================================================

// POST /api/applications/seminarrequest - uses serviceRequestLimiter (10 per hour)
router.post(
    "/seminarrequest",
  
    serviceRequestLimiter,
    submitRequest
);

export default router;