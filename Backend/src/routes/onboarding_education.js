import express from "express";
import { submitEducationDetails } from "../controllers/onboarding_education.js";

const router = express.Router();

router.post("/submit", submitEducationDetails);

export default router;
