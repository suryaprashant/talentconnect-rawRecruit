import express from "express";
import {
  discoverCompanyJobs,
  saveDiscoveredJob,
} from "../controllers/companyJobDiscoveryController.js";
import  secureRoute from "../middlewares/secureRouteMiddleware.js";

const router = express.Router();

router.post("/discover", secureRoute, discoverCompanyJobs);

router.post("/save", secureRoute, saveDiscoveredJob);

export default router;