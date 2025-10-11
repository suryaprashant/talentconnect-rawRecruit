import express from "express";

const router = express.Router();

// import { validateServiceRequest } from "../middlewares/validateservicerequest.js";
import { createServiceRequest } from "src/controllers/servicereequestCompanyEmployeetrainingController.js";

router.post("/servicerequest-employeetraining", createServiceRequest);

export default router;
