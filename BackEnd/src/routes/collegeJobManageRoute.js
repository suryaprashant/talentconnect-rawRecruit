import express from "express";
import {  getCollegePostedJobs, inActiveCollegeJob } from "../controllers/collegeJobManagementController.js";
import secureRoute from '../middlewares/secureRouteMiddleware.js';

const router = express.Router();
// api.. /college/jobmanagement

router.get('/:key/:jobType', secureRoute, getCollegePostedJobs);

router.delete('/delete/:jobId' , secureRoute , inActiveCollegeJob)
export default router; 