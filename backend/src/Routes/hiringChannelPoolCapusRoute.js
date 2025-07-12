import express from 'express';
import { getAllRegistrations, getJobById, poolCampusRegister } from '../controllers/hiringChannelPoolCampus.controller.js';
import secureRoute from '../middlewares/secureRoute.js'

const router = express.Router() ;

// Route to handle pool campus hiring registration
router.post('/poolCampus-register', secureRoute, poolCampusRegister);

router.get('/getAllPoolCampusJobs', getAllRegistrations) ;

router.get('/getPoolCampusJob/:id', getJobById) ;

export default router;