import express from "express";
const router = express.Router();

import {
  createServiceRequest,
  createmockinterviewrequest,
} from "../services/applicationToAdminService.js";

import {
  serviceRequestLimiter,
  adminLimiter,
} from "../middlewares/ratelimiter/index.js";


router.get(
  "/counselling",
  serviceRequestLimiter,
  createServiceRequest
);


router.get(
  "/mock-interview",
  serviceRequestLimiter,
  createmockinterviewrequest
);

export default router;