import multer from "multer";
import path from "path";
import crypto from "crypto";

const ALLOWED = new Set([
  "application/pdf",
  "audio/webm",
  "audio/mpeg",
  "audio/wav",
  "video/webm",
  "video/mp4",
]);

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (_req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase().slice(0, 8);
    cb(null, `${crypto.randomBytes(16).toString("hex")}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED.has(file.mimetype)) {
      return cb(new Error("Unsupported file type"));
    }
    cb(null, true);
  },
});