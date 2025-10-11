import express from "express";

const router = express.Router();

// import { validateServiceRequest } from "../middlewares/validateservicerequest.js";
import { createServiceRequest } from "src/controllers/servicerequestCompanyWorkforcesolutionsController.js";

router.post("/servicerequest-workforce", createServiceRequest);

export default router;
