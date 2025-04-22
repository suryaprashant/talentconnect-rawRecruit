import express from "express";
const router = express.Router();

import {
  createServiceRequest,
  createmockinterviewrequest,
} from "../controllers/application_to_admin.js";

// we have to define the middleware so that only admin can access this route
router.get("/counselling", createServiceRequest);
router.get("/mock-interview", createmockinterviewrequest);

export default router;
