import express from 'express';
import { getOffCampusRegistrations, offCampusRegister } from '../controllers/hiringChannelOffCampusController.js';
import secureRoute from '../middlewares/secureRouteMiddleware.js';


const router = express.Router();

router.post('/offCampusRegister', secureRoute , offCampusRegister);

router.get('/allOffCampusJobs' , getOffCampusRegistrations) ;

export default router;
