// routes/workforceSolutionRequestRoutes.js
import express from "express";
import { submitWorkforceSolutionRequest } from "../controllers/servicerequest_employeer_workforcesolution.js";

const router = express.Router();

router.post(
  "/submit-workforce-solution-request",
  submitWorkforceSolutionRequest
);

export default router;
