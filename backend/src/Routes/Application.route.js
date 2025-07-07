import express from "express";
import { createApplication, getAcceptedCandidates, getAcceptedCandidatesFromCollege, getUserApplication } from "../controllers/application.controller.js";
import secureRoute from '../middlewares/secureRoute.js'

const router = express.Router();

// api '.../application'

router.get('/getall', getUserApplication);
router.post('/apply',secureRoute, createApplication);

// shortlisting


// access only to company 
// accept oncampus
// router.get('/accept/oncampus/:companyId', getAcceptedCandidatesFromCollege);
// accept offcampus
router.get('/accept/:id', getAcceptedCandidates);

export default router;