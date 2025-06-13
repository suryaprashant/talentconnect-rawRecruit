import express from "express";
import {
  createOffCampusRequest,
  getAllOffCampusRequests,
} from "../controllers/hiringchannels_employeer_offcampusrequest.js";

const router = express.Router();

router.post("/offcampus/request", createOffCampusRequest);
router.get("/offcampus/requests", getAllOffCampusRequests);

export default router;
