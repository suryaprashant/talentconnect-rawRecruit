import express from "express";
import { getRegisteredCampus, getRegisteredCampusDetails } from "../controllers/campusPlacementController.js";

const router = express.Router();

// api '.../company/dashboard'
router.get('/oncampus/registeredcampus',getRegisteredCampus);
router.get('/oncampus/registeredcampus/:id',getRegisteredCampusDetails);

export default router;