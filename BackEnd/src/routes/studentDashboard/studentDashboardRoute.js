import express from 'express';
import { getInternshipPostings, getIntershipById, getJobPostings, getOffCampusPostings, getOnCampusPostingForCollegebyID, getOnCampusPostingForCompanybyID, getOnCampusPostings, getOnCampusPostingsForCollege, getOnCampusPostingsForCompany, getPoolCampusForCollege, getPoolCampusForCompany, getPoolCampusJobByIdForCollege, getPoolCampusJobByIdForCompany, getReferralJobById, getReferralJobs } from '../../controllers/studentDashboard/studentDashboardController.js';
import secureRoute from '../../middlewares/secureRouteMiddleware.js';
import { getRelevantOffCampusJobs } from '../../controllers/relevantJobContoller.js';
const router = express.Router();

router.get('/off-campus', secureRoute, getRelevantOffCampusJobs);
router.get('/on-campus',secureRoute, getOnCampusPostingsForCompany);
router.get('/on-campus/company/:id', secureRoute, getOnCampusPostingForCompanybyID);

router.get('/on-campus/college',secureRoute, getOnCampusPostingsForCollege)
router.get("/oncampus/college/:id", getOnCampusPostingForCollegebyID);
// router.get('/pool-campus',secureRoute , getPoolCampusPostings); 

router.get('/getAllPoolCampusJobs', secureRoute, getPoolCampusForCollege);
router.get('/pool-campus/college', secureRoute, getPoolCampusForCollege);
router.get('/getPoolCampusJob/:id', secureRoute, getPoolCampusJobByIdForCollege);

router.get('/pool-campus/company',secureRoute, getPoolCampusForCompany);
router.get('/pool-campus/company/:id', secureRoute, getPoolCampusJobByIdForCompany);

router.get('/job-postings', secureRoute, getJobPostings);
router.get('/internship-postings', secureRoute, getInternshipPostings);
router.get('/getInternshipDetail/:id',getIntershipById)

router.get('/referral-jobs', secureRoute, getReferralJobs);
router.get('/referral-jobs/:id', secureRoute, getReferralJobById);
export default router;