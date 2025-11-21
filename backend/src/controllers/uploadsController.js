// src/controllers/uploadsController.js
import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { imageSize } from "image-size";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const UPLOAD_ROOT = path.join(process.cwd(), "uploads");
const CHAT_DIR = path.join(UPLOAD_ROOT, "chat");
for (const p of [UPLOAD_ROOT, CHAT_DIR]) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function safeName(originalname = "") {
  const base = originalname.normalize("NFKD").replace(/[^\w.-]+/g, "_");
  const stamp = Date.now();
  return `${stamp}_${base}`.toLowerCase();
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, CHAT_DIR),
  filename: (_req, file, cb) => cb(null, safeName(file.originalname)),
});

export const uploadSingleChat = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
}).single("file");

export async function postChatUpload(req, res) {
  try {
    const f = req.file;
    if (!f) return res.status(400).json({ error: "Archivo requerido (field: file)" });

    const mime = f.mimetype || "";
    const sizeBytes = f.size || null;

    let width = null;
    let height = null;
    if (mime.startsWith("image/")) {
      try {
        const dim = imageSize(f.path);
        width = dim.width || null;
        height = dim.height || null;
      } catch {
      }
    }

    const fileUrl = `/uploads/chat/${path.basename(f.path)}`;

    return res.json({
      file_url: fileUrl,
      mime_type: mime,
      size_bytes: sizeBytes,
      width,
      height,
      duration_ms: null,
    });
  } catch (err) {
    console.error("postChatUpload error:", err);
    return res.status(500).json({ error: "Error subiendo archivo" });
  }
}

export async function uploadSingle(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: "Archivo requerido (field: file)" });

    const fileUrl = `/uploads/chat/${req.file.filename}`;

    return res.status(201).json({
      file_url: fileUrl,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });
  } catch (err) {
    console.error("uploadSingle error", err);
    res.status(500).json({ error: "Error subiendo archivo" });
  }
}
