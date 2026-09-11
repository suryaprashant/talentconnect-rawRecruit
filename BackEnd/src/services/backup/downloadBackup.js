import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";

import { GetObjectCommand } from "@aws-sdk/client-s3";

import {
    r2Client,
} from "../../../config/cloudflareR2.config.js";
import cloudflareR2Config from "../../../config/cloudflareR2.config.js";
import backupConfig from "../../../config/backup.config.js";
import logger from "../../utils/logger.js";

class DownloadBackupService {
    async downloadBackup(r2Key) {
        logger.info("========================================");
        logger.info("Downloading Backup From Cloudflare R2");

        try {
            // Ensure backup directory exists
            if (!fs.existsSync(backupConfig.backupDirectory)) {
                fs.mkdirSync(backupConfig.backupDirectory, {
                    recursive: true,
                });
            }

            const fileName = path.basename(r2Key);

            const localFilePath = path.join(
                backupConfig.backupDirectory,
                fileName
            );

            logger.info(`R2 Key: ${r2Key}`);
            logger.info(`Local File: ${localFilePath}`);

            const command = new GetObjectCommand({
                Bucket: cloudflareR2Config.bucketName,
                Key: r2Key,
            });

            const response = await r2Client.send(command);

            await pipeline(
                response.Body,
                fs.createWriteStream(localFilePath)
            );

            const stats = fs.statSync(localFilePath);

            logger.info("Backup Download Completed");
            logger.info(`Size: ${stats.size} bytes`);
            logger.info("========================================");

            return {
                success: true,
                fileName,
                filePath: localFilePath,
                size: stats.size,
            };
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }
}

export default new DownloadBackupService();