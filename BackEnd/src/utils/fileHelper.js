import fs from "fs-extra";

export async function createDirectory(directoryPath) {
    await fs.ensureDir(directoryPath);
}

export async function fileExists(filePath) {
    return fs.pathExists(filePath);
}

export async function deleteFile(filePath) {
    const exists = await fileExists(filePath);

    if (!exists) {
        return false;
    }

    await fs.remove(filePath);

    return true;
}

export async function getFileSize(filePath) {
    const stats = await fs.stat(filePath);

    return stats.size;
}

export async function listFiles(directoryPath) {
    const exists = await fileExists(directoryPath);

    if (!exists) {
        return [];
    }

    return fs.readdir(directoryPath);
}