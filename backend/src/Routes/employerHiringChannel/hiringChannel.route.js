import express from 'express';
import secureRoute from '../../middlewares/secureRoute.js';
import { createJobPosting, createOffCampusHiring, createPoolCampusHiring } from '../../controllers/employerHiringChannel/hiringChannel.controller.js';

const router = express.Router();

router.post('/create-Oncampusjob', secureRoute, createJobPosting);

router.post('/create-poolCampusJob' , secureRoute, createPoolCampusHiring)

router.post('/create-offCampusJob', secureRoute , createOffCampusHiring)

export default router;