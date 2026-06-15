import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const dir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

export const upload = multer({
  storage: multer.diskStorage({
    destination: (_, __, cb) => cb(null, dir),

    filename: (_, file, cb) => {
      cb(
        null,
        crypto.randomUUID() + path.extname(file.originalname)
      );
    },
  }),

  limits: { fileSize: 5 * 1024 * 1024 },

  fileFilter: (_, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    cb(null, allowed.includes(file.mimetype));
  },
});