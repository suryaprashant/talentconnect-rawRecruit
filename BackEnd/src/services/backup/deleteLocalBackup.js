import {
    deleteFile,
    fileExists,
} from "../../utils/fileHelper.js";

import logger from "../../utils/logger.js";

class DeleteLocalBackupService {
    async deleteBackup(filePath) {
        try {
            logger.info("========================================");
            logger.info("Deleting Local Backup");

            const exists = await fileExists(filePath);

            if (!exists) {
                logger.warn("Backup file not found.");

                return {
                    success: false,
                    deleted: false,
                    message: "Backup file does not exist.",
                };
            }

            await deleteFile(filePath);

            logger.info("Local backup deleted successfully.");
            logger.info("========================================");

            return {
                success: true,
                deleted: true,
                filePath,
            };
        } catch (error) {
            logger.error(error);
            throw error;
        }
    }
}

export default new DeleteLocalBackupService();