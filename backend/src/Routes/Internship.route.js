import express from "express";
import { fetchInternshipOpportunities, findOpportunityById } from "../controllers/job.controller.js";

const router = express.Router();

// api '.../internship'
router.get('/',fetchInternshipOpportunities);  //for oncampus ..internship?openingFor=Oncampus
router.get('/:jobId',findOpportunityById);

export default router;