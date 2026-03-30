import { getCareerInsightsWithHiringScore, getUserRanking } from "../controllers/careerInsightsController.js";
import secureRoute from "../middlewares/secureRouteMiddleware.js"; 
import express from "express";

const router = express.Router();

// 🔹 GET career insights with latest hiring score
router.get("/", secureRoute, getCareerInsightsWithHiringScore);
router.get("/ranking", secureRoute, getUserRanking);
export default router;