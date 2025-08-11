// src/routes/uploadsRoutes.js
import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { authenticateToken } from "../middleware/auth.js";
import { uploadSingleChat, postChatUpload, uploadSingle } from "../controllers/uploadsController.js";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.user?.id || "anon";
    const section = (req.query.section || "packages").toString(); // opcional: ?section=gallery
    const uploadPath = path.join("uploads", "business", userId, section);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `file-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

router.post("/chat", authenticateToken, uploadSingleChat, postChatUpload);
router.post("/", authenticateToken, upload.single("file"), uploadSingle);

export default router;
