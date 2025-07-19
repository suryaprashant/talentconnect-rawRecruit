import express from "express";
import { submitRegistration, getAllRegistrations, getRegistrationDetail, createOnCampusApplication } from "../controllers/hiringchannels_oncampusregister.js";
import secureRoute from "../middlewares/secureRoute.js";


const router = express.Router();

// GET /api/rawrecruit
router.post("/oncampus-register", secureRoute, submitRegistration);
router.get("/oncampus-register", getAllRegistrations);
router.get("/oncampus-register/:id", getRegistrationDetail);

router.post('/oncampus/apply', secureRoute, createOnCampusApplication);

export default router;
