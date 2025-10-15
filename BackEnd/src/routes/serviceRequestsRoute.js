import express from 'express';

import { createOnCampusPlacementRequest, PoolCampusRequest, StudentTrainingRequest, CollegeSeminarRequest, createBrandingRequest,createWorkforceRequest, createEmployeeTrainingRequest, createStudentCounsellingRequest, createStudentMockInterviewRequest, createEmployeeTrainingRegistration, createBrandingRegistration } from '../controllers/serviceRequestController.js';
import  secureRoute  from '../middlewares/secureRouteMiddleware.js';
const router = express.Router();

// for the college
router.post('/college/On-campus-Placement',secureRoute , createOnCampusPlacementRequest);
router.post('/college/pool-campus',secureRoute, PoolCampusRequest);
router.post('/college/student-training',secureRoute, StudentTrainingRequest);
router.post('/college-seminar',secureRoute , CollegeSeminarRequest);


// =======>>   Company Side <<==============

// Request Info
router.post('/company/workforce-recruitment', secureRoute, createWorkforceRequest);
router.post('/company/employee-training', secureRoute, createEmployeeTrainingRequest);
router.post('/company/branding', secureRoute, createBrandingRequest);

// Registration Info
router.post('/company/employee-training-registration', secureRoute, createEmployeeTrainingRegistration);
router.post('/company/branding-registration', secureRoute, createBrandingRegistration);


//  =====>>>   Candidate Side  <<<<==========

router.post('/student/counselling', secureRoute, createStudentCounsellingRequest);
router.post('/student/mock-interview', secureRoute, createStudentMockInterviewRequest) ;

export default router;