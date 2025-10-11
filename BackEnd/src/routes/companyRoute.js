import express from "express";
import { createCompanyProfile } from "src/controllers/companyController.js";

const router = express.Router();

// api '.../company'

// create profile
router.post('/', createCompanyProfile);

export default router;