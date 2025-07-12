import express from "express";
import { fetchInternshipOpportunities, findOpportunityById } from "../controllers/job.controller.js";
import secureRoute from "../middlewares/secureRoute.js";

const router = express.Router();

// api '.../internship'
router.get('/',secureRoute,fetchInternshipOpportunities);  //for oncampus ..internship?openingFor=Oncampus
router.get('/:jobId',findOpportunityById);

export default router;