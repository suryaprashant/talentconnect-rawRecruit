import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";

import backupConfig from "../../../config/backup.config.js";


import logger from "../../utils/logger.js";

import {
    createDirectory,
    fileExists,
    getFileSize,
} from "../../utils/fileHelper.js";

import { generateChecksum } from "../../utils/checksum.js";

const execFileAsync = promisify(execFile);

class BackupService {
    async createBackup() {
        const startTime = Date.now();

        logger.info("========================================");
        logger.info("MongoDB Backup Started");

        try {
            if (!backupConfig.mongoDumpPath) {
                throw new Error("MongoDump path is not configured.");
            }

            

            await createDirectory(
                backupConfig.backupDirectory
            );

            const timestamp = new Date()
                .toISOString()
                .replace(/:/g, "-")
                .replace(/\..+/, "");

            const fileName =
                `${backupConfig.backupPrefix}-${timestamp}` +
                backupConfig.backupExtension;

            const filePath = path.join(
                backupConfig.backupDirectory,
                fileName
            );

            logger.info(`Backup File : ${fileName}`);
            logger.info(`Backup Path : ${filePath}`);

            const { stderr } =
                await execFileAsync(
                    backupConfig.mongoDumpPath,
                    [
                        `--uri=${process.env.DB_URL}`,
                        "--gzip",
                        `--archive=${filePath}`,
                    ],
                    {
                        timeout: 10 * 60 * 1000,
                        maxBuffer: 20 * 1024 * 1024,
                    }
                );

            if (stderr && stderr.trim()) {
                logger.warn(stderr);
            }

            const exists = await fileExists(filePath);

            if (!exists) {
                throw new Error(
                    "Backup file was not created."
                );
            }

            const fileSize =
                await getFileSize(filePath);

            const checksum =
                await generateChecksum(filePath);

            const duration =
                ((Date.now() - startTime) / 1000).toFixed(2);

            const backupInfo = {
                success: true,
                fileName,
                filePath,
                fileSize,
                checksum,
                createdAt: new Date().toISOString(),
                duration: `${duration}s`,
            };

            logger.info("Backup Created Successfully");
            logger.info(
                `Backup Size : ${(fileSize / 1024 / 1024).toFixed(2)} MB`
            );
            logger.info(`Checksum : ${checksum}`);
            logger.info(
                `Execution Time : ${duration}s`
            );
            logger.info("========================================");

            return backupInfo;
        } catch (error) {
            logger.error("Backup Failed");
            logger.error(error);

            throw error;
        }
    }
}

export default new BackupService();