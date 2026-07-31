import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const backupConfig = {
  backupDirectory: path.join(__dirname, "../src/backups/temp"),

  backupLogDirectory: path.join(__dirname, "../src/backups/logs"),

  retentionDays: Number(process.env.BACKUP_RETENTION_DAYS || 30),

  backupPrefix: process.env.BACKUP_PREFIX || "mongodb-backup",

  backupExtension: process.env.BACKUP_EXTENSION || ".archive.gz",

  r2Folder: process.env.R2_FOLDER || "mongodb/backups",

  mongoDumpPath: process.env.MONGODUMP_PATH || "mongodump",

  mongoRestorePath: process.env.MONGORESTORE_PATH || "mongorestore",
};

export default backupConfig;
