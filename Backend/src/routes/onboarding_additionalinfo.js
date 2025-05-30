import express from "express";
import { submitAdditionalInfo } from "../controllers/onboarding_additionalinfo.js";

const router = express.Router();

router.post("/submit", submitAdditionalInfo);

export default router;
