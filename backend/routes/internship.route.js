import express from 'express';
import { 
  createInternship, 
  getInternships, 
  getInternship, 
  updateInternship, 
  deleteInternship, 
  getMyInternships 
} from '../controllers/createInterns.controller.js';

import { getApplicationsForJob } from '../controllers/application.controller.js';

const router = express.Router();

// Here We have to use the middleware for the admin 

router.post("/createInternship", createInternship);
router.get("/getInternships", getInternships);
router.get('/getInternship/:id', getInternship);
router.patch("/updateInternship/:id", updateInternship);
router.delete('/deleteInternship/:id', deleteInternship);

// get internships created by logged in user
router.get('/myInternships', getMyInternships);

// get all user who apply for particular Job
router.get('/getapplication/:jobId',getApplicationsForJob);


export default router;