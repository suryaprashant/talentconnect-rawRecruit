import express from "express";
import { createCompanyMasterData, createCompanyProfile, getCompanyMasterData } from "../controllers/companyController.js";
import secureRoute from "../middlewares/secureRouteMiddleware.js";

const router = express.Router();

// api '.../company'

// create profile
//router.post('/', createCompanyProfile);
// GET dropdown values
router.get("/", getCompanyMasterData);

// POST custom value (during onboarding)
router.post("/", secureRoute, createCompanyMasterData);

export default router;