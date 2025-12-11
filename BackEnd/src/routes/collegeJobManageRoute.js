import express from "express";
import { deleteCollegeJob, getCollegePostedJobs } from "../controllers/collegeJobManagementController.js";
import secureRoute from '../middlewares/secureRouteMiddleware.js';

const router = express.Router();


router.get('/:key/:jobType', secureRoute, getCollegePostedJobs);

router.delete('/delete/:jobId' , secureRoute , deleteCollegeJob)
export default router; 