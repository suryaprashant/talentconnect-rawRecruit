import express from "express";
import  {deleteJobWithApplications } from "../controllers/deleteJobController.js";
import secureRoute from "../middlewares/secureRouteMiddleware.js";

const router = express.Router();

router.delete("/:jobId", secureRoute ,deleteJobWithApplications);

export default router;