import express from "express";
import { createApplication, getAcceptedCandidates, getAcceptedCandidatesFromCollege, getUserApplication } from "../controllers/application.controller.js";

const router = express.Router();

// api '.../application'

router.get('/', getUserApplication);
router.post('/apply', createApplication);

// shortlisting

// access to only company 
// accept offcampus
router.get('/accept', getAcceptedCandidates);
// accept oncampus
router.get('/accept/oncampus/:id', getAcceptedCandidatesFromCollege);

export default router;