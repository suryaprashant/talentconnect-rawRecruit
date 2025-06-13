// routes/employeeTrainingRequestRoutes.js
import express from "express";
import { submitEmployeeTrainingRequest } from "../controllers/servicerequest_employeer_trainingrequests.js";

const router = express.Router();

router.post("/submit-training-request", submitEmployeeTrainingRequest);

export default router;
