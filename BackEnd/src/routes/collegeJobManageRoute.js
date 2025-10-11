import express from "express";
import { getCollegePostedJobs } from "src/controllers/collegeJobManagementController.js";
import secureRoute from 'src/middlewares/secureRouteMiddleware.js';

const router = express.Router();


router.get('/:jobType', secureRoute, getCollegePostedJobs);


export default router; 