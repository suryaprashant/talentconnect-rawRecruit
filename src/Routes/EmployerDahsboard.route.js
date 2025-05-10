import express from "express";
import { getRegisteredCampus } from "../controllers/campusPlacement.controller.js";

const router = express.Router();

// api '.../company/dashboard/oncampus'
router.get('/registeredcampus',getRegisteredCampus);

export default router;