import createBackupService from "../services/backup/createBackup.js";
import uploadBackupService from "../services/backup/uploadBackup.js";
import downloadBackupService from "../services/backup/downloadBackup.js";
import restoreBackupService from "../services/backup/restoreBackup.js";
import deleteLocalBackupService from "../services/backup/deleteLocalBackup.js";
import deleteOldBackupsService from "../services/backup/deleteOldBackups.js";

class BackupController {
    // POST /backup/create
    async createBackup(req, res) {
        try {
            const backup =
                await createBackupService.createBackup();

            const upload =
                await uploadBackupService.uploadBackup(
                    backup.filePath,
                    backup.fileName
                );

            await deleteLocalBackupService.deleteBackup(
                backup.filePath
            );

            return res.status(200).json({
                success: true,
                message: "Backup created successfully.",
                data: upload,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    
    async restoreBackup(req, res) {
        try {
            const { key } = req.body;

            if (!key) {
                return res.status(400).json({
                    success: false,
                    message: "Backup key is required.",
                });
            }

            const download =
                await downloadBackupService.downloadBackup(
                    key
                );

            const restore =
                await restoreBackupService.restoreBackup(
                    download.filePath
                );

            await deleteLocalBackupService.deleteBackup(
                download.filePath
            );

            return res.status(200).json({
                success: true,
                message: "Database restored successfully.",
                data: restore,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    
    async cleanupBackups(req, res) {
        try {
            const result =
                await deleteOldBackupsService.deleteOldBackups();

            return res.status(200).json({
                success: true,
                message: "Old backups cleaned successfully.",
                data: result,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
}

export default new BackupController();