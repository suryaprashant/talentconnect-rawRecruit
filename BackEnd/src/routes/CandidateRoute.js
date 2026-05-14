import express from 'express';
import secureRoute from "../middlewares/secureRouteMiddleware.js";
//import { getAlumniPostedJobs,ProfileScore,getNewApplications} from '../controllers/AlumniJobsController.js';
import { getAlumniWhoCanHelp ,getAlumniHiringNetwork, ProfileScore, getNewApplications, getCollegeAlumni, getCompanyAlumni } from '../controllers/AlumniJobsController.js';
const router = express.Router();

router.get('/college-alumni', secureRoute, getCollegeAlumni);
router.get('/company-alumni', secureRoute, getCompanyAlumni);
router.get('/alumni/:company/:postedByUser', secureRoute, getAlumniWhoCanHelp);
router.get('/profile-score',secureRoute,ProfileScore)
router.get('/new-application',secureRoute,getNewApplications)
router.get('/hiring-network',secureRoute,getAlumniHiringNetwork)

export default router;