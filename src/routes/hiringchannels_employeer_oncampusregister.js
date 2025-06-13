import express from "express";
import {
  createOnCampusRegistration,
  getAllOnCampusRegistrations,
} from "../controllers/hiringchannels_employeer_oncampusregister.js";

const router = express.Router();

router.post("/oncampus/register", createOnCampusRegistration);
router.get("/oncampus/registers", getAllOnCampusRegistrations);

export default router;
