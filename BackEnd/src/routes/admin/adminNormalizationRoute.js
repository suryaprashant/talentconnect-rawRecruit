import express from "express";

import {
  getPendingNormalizations,
  approveNormalization,
  rejectNormalization,
  createCanonicalEntity,
  mergeCanonicalEntity,
  getAllData
} from "../../controllers/admin/adminNormalizationController.js";
import adminAuth from "../../middlewares/adminMiddleware.js";
const router = express.Router();
router.use(adminAuth);
router.get("/pending", getPendingNormalizations);
router.get("/all", getAllData);

router.patch("/:id/approve", approveNormalization);

router.patch("/:id/reject", rejectNormalization);

router.post("/:id/create", createCanonicalEntity);

router.post("/merge", mergeCanonicalEntity);
export default router;
