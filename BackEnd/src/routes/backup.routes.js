import { Router } from "express";

import backupController from "../controllers/backup.controller.js";
import adminAuth from "../middlewares/adminMiddleware.js"

const router = Router();

router.post(
    "/create",
    adminAuth,
    backupController.createBackup
);

router.post(
    "/restore",
    adminAuth,
    backupController.restoreBackup
);

router.post(
    "/cleanup",
    adminAuth,
    backupController.cleanupBackups
);

export default router;