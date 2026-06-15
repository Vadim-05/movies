import fs from "fs/promises";
import path from "path";
import { StorageService } from "./storage.interface";

export class LocalStorageService implements StorageService {
  async upload(file: Express.Multer.File): Promise<string> {
    return `/uploads/${file.filename}`;
  }

  async delete(filePath: string): Promise<void> {
    try {
      const fileName = path.basename(filePath);

      const fullPath = path.join(
        process.cwd(),
        "uploads",
        fileName
      );

      await fs.unlink(fullPath);
    } catch (err) {
      console.error("Failed to delete file:", err);
    }
  }
}