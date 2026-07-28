// routes/campusPlacementRoutes.js
import express from "express";
import { registerCampusPlacement } from "../controllers/servicerequest_oncampusplacement.js";
import { serviceRequestLimiter } from "../middlewares/ratelimiter/index.js";

const router = express.Router();
router.post("/campus-placement/register", serviceRequestLimiter, registerCampusPlacement);

export default router;