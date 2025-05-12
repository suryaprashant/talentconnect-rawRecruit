import express from 'express' ;

import { createJob , getJobs, updateJob , deleteJob , getMyJobs, getJob } from '../controllers/createJob.controller.js';
import { getApplicationsForJob } from '../controllers/application.controller.js';
const router = express.Router() ;

// Here We have to use the middleware for the admin when signup  part will be done 

router.post("/createJob" , createJob);
router.get("/getJobs" , getJobs);
router.patch("/updateJob" , updateJob) ;
router.get('/getjob/:id', getJob);   
router.delete('/deletejob/:id', deleteJob); 

// get job created by login user
router.get('/myjobs', getMyJobs);

// get all user who apply for particular Job
router.get('/getapplication/:jobId',getApplicationsForJob);


export default router;