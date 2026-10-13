import { execFile } from "child_process";
import { promisify } from "util";

import backupConfig from "../../../config/backup.config.js";

import logger from "../../utils/logger.js";
import { fileExists } from "../../utils/fileHelper.js";

const execFileAsync = promisify(execFile);

class RestoreBackupService {
    async restoreBackup(filePath) {
        const startTime = Date.now();

        logger.info("========================================");
        logger.info("MongoDB Restore Started");

        try {
            if (!backupConfig.mongoRestorePath) {
                throw new Error(
                    "MongoRestore path is not configured."
                );
            }

            if (!process.env.MONGODB_URI) {
                throw new Error(
                    "MONGODB_URI is not configured."
                );
            }

            const exists = await fileExists(filePath);

            if (!exists) {
                throw new Error(
                    `Backup file not found: ${filePath}`
                );
            }

            logger.info(`Backup File : ${filePath}`);
            logger.info("Executing mongorestore...");

            const { stdout, stderr } =
                await execFileAsync(
                    backupConfig.mongoRestorePath,
                    [
                        `--uri=${process.env.DB_URL}`,
                        "--gzip",
                        "--drop",
                        `--archive=${filePath}`,
                    ],
                    {
                        windowsHide: true,
                        timeout: 10 * 60 * 1000, // 10 minutes
                        maxBuffer: 20 * 1024 * 1024,
                    }
                );

            if (stdout?.trim()) {
                logger.info(stdout);
            }

            if (stderr?.trim()) {
                logger.warn(stderr);
            }

            const duration =
                ((Date.now() - startTime) / 1000).toFixed(2);

            logger.info("MongoDB Restore Completed Successfully");
            logger.info(`Execution Time : ${duration}s`);
            logger.info("========================================");

            return {
                success: true,
                restored: true,
                filePath,
                restoredAt: new Date().toISOString(),
                duration: `${duration}s`,
            };
        } catch (error) {
            logger.error("MongoDB Restore Failed");
            logger.error(error);

            throw error;
        }
    }
}

export default new RestoreBackupService();