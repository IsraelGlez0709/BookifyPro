import { Router } from "express";
import multer from "multer";
import { storage } from "../config/cloudinary.js"; 
import { authenticateToken } from "../middleware/auth.js";
import { uploadSingleChat, postChatUpload, uploadSingle } from "../controllers/uploadsController.js";

const router = Router();

const upload = multer({ storage }); 

router.post("/chat", authenticateToken, upload.single("file"), postChatUpload); 
router.post("/", authenticateToken, upload.single("file"), uploadSingle);

export default router;