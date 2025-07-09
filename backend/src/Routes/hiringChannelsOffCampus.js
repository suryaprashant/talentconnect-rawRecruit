import express, { Router } from 'express';
import { getOffCampusRegistrations, offCampusRegister } from '../controllers/hiringchannels_offcampusregister.js';
import { secureRoute } from '../middlewares/secureRoute.js';


const router = express.Router();

router.post('/offCampusRegister', secureRoute , offCampusRegister);

router.get('/allOffCampusJobs' , getOffCampusRegistrations);