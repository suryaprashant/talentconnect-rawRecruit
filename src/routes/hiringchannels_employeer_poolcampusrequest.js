import express from "express";
import {
  createPoolCampusRequest,
  getAllPoolCampusRequests,
} from "../controllers/hiringchannels_employeer_poolcampus.js";

const router = express.Router();

router.post("/poolcampus/request", createPoolCampusRequest);
router.get("/poolcampus/requests", getAllPoolCampusRequests);

export default router;
