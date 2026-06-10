import express from 'express';
import secureRoute from "../middlewares/secureRouteMiddleware.js";
//import { getAlumniPostedJobs,ProfileScore,getNewApplications} from '../controllers/AlumniJobsController.js';
import { getAlumniWhoCanHelp ,getAlumniHiringNetwork, ProfileScore, getNewApplications, getCollegeAlumni, getCompanyAlumni,getNewUser,checkAlumniByCareerPageUrl } from '../controllers/AlumniJobsController.js';
import verifyUser from '../middlewares/verifyUser.js';
const router = express.Router();

router.get('/college-alumni', secureRoute, getCollegeAlumni);
router.get('/company-alumni', secureRoute, getCompanyAlumni);
router.get('/alumni/:company/:postedByUser', secureRoute, getAlumniWhoCanHelp);
router.get('/profile-score',secureRoute,ProfileScore)
router.get('/new-application',secureRoute,getNewApplications)
router.get('/hiring-network',secureRoute,getAlumniHiringNetwork)
router.get('/new-users',verifyUser,getNewUser)
router.post('/check-alumni-by-url', secureRoute ,checkAlumniByCareerPageUrl);

export default router;