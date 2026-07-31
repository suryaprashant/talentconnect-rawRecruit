import { Router } from "express";

import backupController from "../controllers/backup.controller.js";

const router = Router();

router.post(
    "/create",
    backupController.createBackup
);

router.post(
    "/restore",
    backupController.restoreBackup
);

router.post(
    "/cleanup",
    backupController.cleanupBackups
);

export default router;