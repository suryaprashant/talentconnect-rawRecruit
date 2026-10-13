import express from "express";
import secureRoute from "../middlewares/secureRouteMiddleware.js";
import { createExtraction } from "../controllers/jobUrlExtractionController.js";

const router = express.Router();
router.post("/extract-from-url", secureRoute, createExtraction);
export default router;
