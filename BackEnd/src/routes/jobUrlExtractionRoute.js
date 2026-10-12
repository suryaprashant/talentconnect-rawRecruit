import express from "express";
import secureRoute from "../middlewares/secureRouteMiddleware.js";
import { createExtraction, getExtractionStatus } from "../controllers/jobUrlExtractionController.js";

const router = express.Router();
router.post("/extract-from-url",secureRoute,  createExtraction);
router.get("/:jobId/status",secureRoute, getExtractionStatus);
export default router;
