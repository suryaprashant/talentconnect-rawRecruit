import express from "express";
import {
  createOffCampusHiring,
  getAllOffCampusHiring,
} from "../controllers/hiringchannels_employeer_offcampusregister.js";

const router = express.Router();

router.post("/offcampus/register", createOffCampusHiring);
router.get("/offcampus/registers", getAllOffCampusHiring);

export default router;
