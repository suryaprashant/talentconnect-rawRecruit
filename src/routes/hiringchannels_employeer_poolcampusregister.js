import express from "express";
import {
  createPoolCampusRegistration,
  getAllPoolCampusRegistrations,
} from "../controllers/hiringchannels_employeer_poolcampusregister.js";

const router = express.Router();

router.post("/poolcampus/register", createPoolCampusRegistration);
router.get("/poolcampus/registers", getAllPoolCampusRegistrations);

export default router;
