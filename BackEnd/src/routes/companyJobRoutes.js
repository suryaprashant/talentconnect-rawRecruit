import express from "express";
import {
  discoverCompanyJobs,
  getDiscoveredJobs,
} from "../controllers/companyJobDiscoveryController.js";

import secureRoute from "../middlewares/secureRouteMiddleware.js";

const router = express.Router();

router.post("/discover", secureRoute, discoverCompanyJobs);
router.get("/discovered/:companyName",secureRoute, getDiscoveredJobs);

export default router;
