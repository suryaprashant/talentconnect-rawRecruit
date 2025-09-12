import express from "express";
import { fetchInternshipOpportunities, findOpportunityById } from "../controllers/jobController.js";
import secureRoute from "../middlewares/secureRouteMiddleware.js";

const router = express.Router();

// api '.../internship'
router.get('/', secureRoute, fetchInternshipOpportunities);
router.get('/getInternshipDetail/:jobId', findOpportunityById);

export default router;