import express from "express";
import { deleteJobWithApplications } from "../controllers/deleteJobController.js";
import secureRoute from "../middlewares/secureRouteMiddleware.js";
import {
    deleteAccountLimiter,
} from "../middlewares/ratelimiter/index.js";

const router = express.Router();

// ============================================================
// Delete Job Route (Destructive Operation)
// ============================================================

// DELETE job with all associated applications - uses deleteAccountLimiter (2 per day)
router.delete(
    "/:jobId",
    secureRoute,
    deleteAccountLimiter,
    deleteJobWithApplications
);

export default router;