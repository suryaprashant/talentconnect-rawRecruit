import express from "express";

import {
  getPendingNormalizations,
  approveNormalization,
  rejectNormalization,
} from "../../controllers/admin/adminNormalizationController.js";
import adminAuth from "../../middlewares/adminMiddleware.js";
const router =
  express.Router();
router.use(adminAuth);
router.get(
  "/pending",
  getPendingNormalizations
);

router.patch(
  "/:id/approve",
  approveNormalization
);

router.patch(
  "/:id/reject",
  rejectNormalization
);

export default router;