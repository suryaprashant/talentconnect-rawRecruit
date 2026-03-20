import express from 'express';
import secureRoute from "../middlewares/secureRouteMiddleware.js";
import { getAlumniPostedJobs,ProfileScore } from '../controllers/AlumniJobsController.js';
const router = express.Router();

router.get('/alumni',secureRoute,getAlumniPostedJobs)
router.get('/profile-score',secureRoute,ProfileScore)

export default router;