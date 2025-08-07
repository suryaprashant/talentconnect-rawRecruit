import express from 'express';
import { getInternshipPostings, getJobPostings, getOffCampusPostings, getOnCampusPostings, getPoolCampusPostings } from '../../controllers/studentDashboard/studentDashboardController.js';
import secureRoute from '../../middlewares/secureRoute.js';

const router = express.Router(); 

router.get('/off-campus' ,secureRoute , getOffCampusPostings);
router.get('/on-campus', secureRoute ,getOnCampusPostings);
router.get('/pool-campus',secureRoute , getPoolCampusPostings); 
router.get('/job-postings', secureRoute, getJobPostings);
router.get('/internship-postings', secureRoute,getInternshipPostings);

export default router;