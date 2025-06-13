// routes/placementRoutes.js
import express from "express";
import { registerPlacement } from "../controllers/servicerequest_college_oncampus.js";

const router = express.Router();

// POST /api/placements/register
router.post("/registeroncampus", registerPlacement);

export default router;
