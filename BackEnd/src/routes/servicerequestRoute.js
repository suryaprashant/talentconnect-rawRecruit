import express from "express";

const router = express.Router();

import { validateServiceRequest } from "src/middlewares/validateServicerequestMiddleware.js";
import { createServiceRequest } from "src/controllers/servicerequest.js";

router.post("/servicerequest", createServiceRequest);

export default router;
