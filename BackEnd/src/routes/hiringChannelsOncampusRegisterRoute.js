import express from "express";
import { submitRegistration, getAllRegistrations, getRegistrationDetail, getOncampusCollegeApplication } from "../controllers/hiringChannelsOncampusRegisterController.js";
import secureRoute from "../middlewares/secureRouteMiddleware.js";


const router = express.Router();

// GET /api/rawrecruit
router.post("/oncampus-register", secureRoute, submitRegistration);
router.get("/oncampus-register", getAllRegistrations);
router.get("/oncampus-register/:id", getRegistrationDetail);

router.post('/college/oncampus', secureRoute, getOncampusCollegeApplication);

export default router;
