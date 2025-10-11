import express from "express";
import { submitRequest } from "src/controllers/servicerequestOncampusinfoController.js";

const router = express.Router();

router.post("/request-on-campus", submitRequest);

export default router;
