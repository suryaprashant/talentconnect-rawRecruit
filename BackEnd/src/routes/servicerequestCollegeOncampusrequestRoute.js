import express from "express";
import { submitRequestInfo } from "../controllers/servicerequqestCollegeOncampusrequestController.js";
import secureRoute from "../middlewares/secureRouteMiddleware.js";
import { serviceRequestLimiter } from "../middlewares/ratelimiter/index.js";

const router = express.Router();

// ============================================================
// Service Request College On-Campus Route
// ============================================================

// POST submit service request - uses serviceRequestLimiter (10 per hour)
router.post(
  "/submit",

  serviceRequestLimiter,
  submitRequestInfo,
);

export default router;
