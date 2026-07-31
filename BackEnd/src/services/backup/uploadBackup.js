import fs from "fs";
import path from "path";

import backupConfig from "../../../config/backup.config.js";

import logger from "../../utils/logger.js";

import {
    fileExists,
    getFileSize,
} from "../../utils/fileHelper.js";

import r2Service from "../r2/r2Client.js";

class UploadBackupService {
    async uploadBackup(filePath, fileName) {
        logger.info("========================================");
        logger.info("Cloudflare R2 Upload Started");

        try {
            const exists = await fileExists(filePath);

            if (!exists) {
                throw new Error(
                    `Backup file not found : ${filePath}`
                );
            }

            const fileSize =
                await getFileSize(filePath);

            const fileSizeMB =
                (fileSize / 1024 / 1024).toFixed(2);

            logger.info(
                `Uploading ${fileName}`
            );

            logger.info(
                `Size : ${fileSizeMB} MB`
            );

            const fileStream =
                fs.createReadStream(filePath);

            const r2Key = path
                .join(
                    backupConfig.r2Folder,
                    fileName
                )
                .replace(/\\/g, "/");

            const response =
                await r2Service.uploadFile({
                    key: r2Key,

                    body: fileStream,

                    contentType:
                        "application/gzip",

                    metadata: {
                        uploadedAt:
                            new Date().toISOString(),

                        backupType: "mongodb",

                        fileName,

                        fileSize:
                            fileSize.toString(),
                    },
                });

            logger.info("Upload Successful");

            logger.info(
                `R2 Key : ${response.key}`
            );

            logger.info("========================================");

            return {
                success: true,

                key: response.key,

                fileName,

                filePath,

                size: fileSize,

                uploadedAt:
                    new Date().toISOString(),
            };
        } catch (error) {
            logger.error(error);

            throw error;
        }
    }
}

export default new UploadBackupService();