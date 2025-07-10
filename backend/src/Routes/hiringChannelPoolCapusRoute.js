import express from 'express';
import { poolCampusRegister } from '../controllers/hiringChannelPoolCampus.controller.js';
import {secureRoute} from '../middlewares/secureRoute.js'

const router = express.Router() ;

// Route to handle pool campus hiring registration
router.post('/poolCampus-register', secureRoute, poolCampusRegister);

export default router;