import express from "express";
import { submitRegistration, getAllRegistrations,getRegistrationDetail } from "../controllers/hiringchannels_oncampusregister.js";

const router = express.Router();

// GET /api/rawrecruit
router.post("/oncampus-register", submitRegistration);
router.get("/oncampus-register", getAllRegistrations);
router.get("/oncampus-register/:id", getRegistrationDetail);

export default router;
