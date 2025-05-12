import express from "express";
import { createApplication, getAcceptedCandidates, getAcceptedCandidatesFromCollege, getUserApplication } from "../controllers/application.controller.js";

const router = express.Router();

// api '.../application'

router.get('/', getUserApplication);
router.post('/apply', createApplication);

// shortlisting


// access to only company 
// accept oncampus
router.get('/accept/oncampus/:id', getAcceptedCandidatesFromCollege);
// accept offcampus
router.get('/accept/:id', getAcceptedCandidates);

export default router;