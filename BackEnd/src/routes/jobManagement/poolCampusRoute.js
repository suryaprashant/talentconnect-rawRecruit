import express from 'express' ;

// import secureRoute from '../../middlewares/secureRouteMiddleware.js';
// import { getCollegesForJob, getCompanyPoolCampusHiringWithApplications } from '../../controllers/hiringChannelPoolCampusController.js';
import { getAllCompanies, createCompany } from '../../controllers/company.controller.js';
const router = express.Router() ;

//  router.get('/jobmanagement/pool-campus-drives',secureRoute , getCompanyPoolCampusHiringWithApplications) ;
// routes/hiringChannelPoolCampus.route.js
// router.get('/jobmanagement/pool-campus-drives/:jobId/colleges', secureRoute, getCollegesForJob);
router.get('/', getAllCompanies);
router.post('/', createCompany);

export default router ;