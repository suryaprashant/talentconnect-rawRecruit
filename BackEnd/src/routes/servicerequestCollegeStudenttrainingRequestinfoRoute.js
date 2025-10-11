// routes/studentRegistrationRoutes.js
import express from "express";
import { registerStudent } from "../controllers/servicerequestCollegeStudenttrainingRequestinfoController.js";

const router = express.Router();

router.post("/student-training-requestinfo", registerStudent);

export default router;
