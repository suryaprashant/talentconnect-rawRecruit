import cron from "node-cron";

import createBackupService from "../services/backup/createBackup.js";
import uploadBackupService from "../services/backup/uploadBackup.js";
import deleteLocalBackupService from "../services/backup/deleteLocalBackup.js";
import deleteOldBackupsService from "../services/backup/deleteOldBackups.js";

import logger from "../utils/logger.js";

class BackupCron {
    start() {
        logger.info("========================================");
        logger.info("MongoDB Backup Cron Started");
        logger.info("Schedule: Every day at 02:00 AM");
        logger.info("========================================");

        cron.schedule(
            "0 2 * * *",
            async () => {
                logger.info("========================================");
                logger.info("Backup Cron Job Started");

                try {
                    // Step 1: Create Backup
                    const backup =
                        await createBackupService.createBackup();

                    // Step 2: Upload to Cloudflare R2
                    await uploadBackupService.uploadBackup(
                        backup.filePath,
                        backup.fileName
                    );

                    // Step 3: Delete Local Backup
                    await deleteLocalBackupService.deleteBackup(
                        backup.filePath
                    );

                    // Step 4: Cleanup Old Backups
                    await deleteOldBackupsService.deleteOldBackups();

                    logger.info("Backup Cron Completed Successfully");
                    logger.info("========================================");
                } catch (error) {
                    logger.error("Backup Cron Failed");
                    logger.error(error);
                }
            },
            {
                timezone: "Asia/Kolkata",
            }
        );
    }
}

export default new BackupCron();