// routes/studentRegistrationRoutes.js
import express from "express";
import { registerStudent } from "../controllers/servicerequestCollegeStudenttrainingRequestinfoController.js";
import { serviceRequestLimiter } from "../middlewares/ratelimiter/index.js";

const router = express.Router();

 
router.post("/student-training-requestinfo", serviceRequestLimiter, registerStudent);

export default router;