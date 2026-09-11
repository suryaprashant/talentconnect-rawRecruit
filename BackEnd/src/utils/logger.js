import fs from "fs";
import path from "path";
import winston from "winston";
import backupConfig from "../../config/backup.config.js";

// Ensure log directory exists
if (!fs.existsSync(backupConfig.backupLogDirectory)) {
    fs.mkdirSync(backupConfig.backupLogDirectory, {
        recursive: true,
    });
}

const logFile = path.join(
    backupConfig.backupLogDirectory,
    "backup.log"
);

const logger = winston.createLogger({
    level: "info",

    format: winston.format.combine(
        winston.format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss",
        }),
        winston.format.errors({
            stack: true,
        }),
        winston.format.printf(
            ({ timestamp, level, message, stack }) => {
                return `[${timestamp}] ${level.toUpperCase()} : ${
                    stack || message
                }`;
            }
        )
    ),

    transports: [
        new winston.transports.Console(),

        new winston.transports.File({
            filename: logFile,
        }),
    ],
});

export default logger;