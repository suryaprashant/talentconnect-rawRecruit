import express from 'express';
import secureRoute from "../middlewares/secureRouteMiddleware.js";
import { getAlumniPostedJobs,ProfileScore,getNewApplications} from '../controllers/AlumniJobsController.js';
const router = express.Router();

router.get('/alumni',secureRoute,getAlumniPostedJobs)
router.get('/profile-score',secureRoute,ProfileScore)
router.get('/new-application',secureRoute,getNewApplications)

export default router;