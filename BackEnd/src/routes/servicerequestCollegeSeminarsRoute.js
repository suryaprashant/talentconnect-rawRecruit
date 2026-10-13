import express from "express";
import { submitRequest } from "../controllers/servicerequestCollegeSeminarController.js";
import { serviceRequestLimiter } from "../middlewares/ratelimiter/index.js";

const router = express.Router();

// POST /api/seminars - Submit a service request
router.post("/seminars", serviceRequestLimiter, submitRequest);

export default router;