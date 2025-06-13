import express from "express";
import {
  createOnCampusRequest,
  getAllOnCampusRequests,
} from "../controllers/hiringchannels_employeer_oncampusrequest.js";

const router = express.Router();

router.post("/oncampus/request", createOnCampusRequest);
router.get("/oncampus/requests", getAllOnCampusRequests);

export default router;
