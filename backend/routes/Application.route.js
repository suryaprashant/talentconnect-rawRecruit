import express from "express";
import { createApplication, getUserApplication, getApplicationsForJob } from "../controllers/application.controller.js";

const router=express.Router();

// api '.../studentApply'
router.get('/',getUserApplication);
router.get('/getapplication/:jobId',getApplicationsForJob);
router.post('/application',createApplication);

export default router;