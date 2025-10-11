import express from 'express';
import secureRoute from 'src/middlewares/secureRouteMiddleware.js';
import { createInternshipPosting, createJobPosting, createOffCampusJobPosting, createOnCampusPosting, createPoolCampusPosting } from 'src/controllers/employerHiringChannel/hiringChannelController.js';


const router = express.Router();


router.post('/create-job-postingg' , secureRoute , createJobPosting) ;

router.post('/create-Oncampusjob', secureRoute, createOnCampusPosting );

router.post('/create-poolCampusJob' , secureRoute, createPoolCampusPosting )

router.post('/create-offCampusJob', secureRoute , createOffCampusJobPosting) ;


router.post('/create-internship-posting' , secureRoute , createInternshipPosting) ;

export default router;