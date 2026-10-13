import fs from "fs/promises";
import path from "path";

import {
    ListObjectsV2Command,
    DeleteObjectCommand,
} from "@aws-sdk/client-s3";

import backupConfig from "../../../config/backup.config.js";
import cloudflareR2Config, {
    r2Client,
} from "../../../config/cloudflareR2.config.js";

import logger from "../../utils/logger.js";

class DeleteOldBackupsService {
    async deleteOldBackups() {
        logger.info("========================================");
        logger.info("Deleting Old Backups");

        const retentionDays = backupConfig.retentionDays;

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

        const result = {
            deletedLocal: [],
            deletedR2: [],
        };

        try {
            // ==========================
            // Delete Local Backups
            // ==========================

            try {
                const files = await fs.readdir(
                    backupConfig.backupDirectory
                );

                for (const file of files) {
                    const filePath = path.join(
                        backupConfig.backupDirectory,
                        file
                    );

                    const stat = await fs.stat(filePath);

                    if (stat.mtime < cutoffDate) {
                        await fs.unlink(filePath);

                        logger.info(
                            `Deleted Local Backup: ${file}`
                        );

                        result.deletedLocal.push(file);
                    }
                }
            } catch (err) {
                logger.warn(
                    `Local cleanup skipped: ${err.message}`
                );
            }

            // ==========================
            // Delete R2 Backups
            // ==========================

            const listResponse =
                await r2Client.send(
                    new ListObjectsV2Command({
                        Bucket:
                            cloudflareR2Config.bucketName,
                        Prefix:
                            backupConfig.r2Folder + "/",
                    })
                );

            const objects =
                listResponse.Contents || [];

            for (const object of objects) {
                if (
                    object.LastModified &&
                    object.LastModified < cutoffDate
                ) {
                    await r2Client.send(
                        new DeleteObjectCommand({
                            Bucket:
                                cloudflareR2Config.bucketName,
                            Key: object.Key,
                        })
                    );

                    logger.info(
                        `Deleted R2 Backup: ${object.Key}`
                    );

                    result.deletedR2.push(object.Key);
                }
            }

            logger.info(
                `Local Deleted : ${result.deletedLocal.length}`
            );

            logger.info(
                `R2 Deleted : ${result.deletedR2.length}`
            );

            logger.info("========================================");

            return {
                success: true,
                retentionDays,
                ...result,
            };
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }
}

export default new DeleteOldBackupsService();