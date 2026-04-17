import express from 'express';
import { getInternshipPostings, getIntershipById, getJobPostings, getOffCampusPostings, getOnCampusPostingForCollegebyID, getOnCampusPostingForCompanybyID, getOnCampusPostings, getOnCampusPostingsForCollege, getOnCampusPostingsForCompany, getPoolCampusForCollege, getPoolCampusForCompany, getPoolCampusJobByIdForCollege, getPoolCampusJobByIdForCompany, getReferralJobById, getReferralJobs ,getProfessionalReferrals } from '../../controllers/studentDashboard/studentDashboardController.js';
import secureRoute  from '../../middlewares/secureRouteMiddleware.js';
import verifyUser from '../../middlewares/verifyUser.js';
import { getRelevantOffCampusJobs } from '../../controllers/relevantJobContoller.js';
const router = express.Router();

router.get('/off-campus', verifyUser, getRelevantOffCampusJobs);//
router.get('/on-campus',verifyUser, getOnCampusPostingsForCompany);
router.get('/on-campus/company/:id', secureRoute, getOnCampusPostingForCompanybyID);

router.get('/on-campus/college',verifyUser, getOnCampusPostingsForCollege)
router.get("/oncampus/college/:id", getOnCampusPostingForCollegebyID);
// router.get('/pool-campus',secureRoute , getPoolCampusPostings); 

router.get('/getAllPoolCampusJobs', verifyUser, getPoolCampusForCollege);
router.get('/pool-campus/college',verifyUser, getPoolCampusForCollege);
router.get('/getPoolCampusJob/:id', verifyUser, getPoolCampusJobByIdForCollege);

router.get('/pool-campus/company',verifyUser, getPoolCampusForCompany);//
router.get('/pool-campus/company/:id', secureRoute, getPoolCampusJobByIdForCompany);

router.get('/job-postings', secureRoute, getJobPostings);
router.get('/internship-postings', verifyUser, getInternshipPostings); //
router.get('/getInternshipDetail/:id',getIntershipById)

router.get('/referral-jobs', verifyUser, getReferralJobs); // 
router.get('/posted-referral-job', secureRoute, getProfessionalReferrals);


router.get('/referral-jobs/:id', secureRoute, getReferralJobById);
export default router;