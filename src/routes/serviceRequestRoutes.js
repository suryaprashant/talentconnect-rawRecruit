import express from "express";
// import { createemployer } from "../controllers/serviceRequestController.js";
import { createemployer } from "../controllers/serviceRequestController.js";
const router = express.Router();

// POST /api/request-info
router.post("/request-info", createemployer);
// ${import.meta.env.VITE_API_BASE_URL}/request-info
export default router;
