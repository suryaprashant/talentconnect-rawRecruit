import express from "express";
const router = express.Router();

import {
  createServiceRequest,
  createmockinterviewrequest,
} from "../services/applicationToAdminService.js";

// we have to define the middleware so that only admin can access this route
router.get("/counselling", createServiceRequest);
router.get("/mock-interview", createmockinterviewrequest);

export default router;
