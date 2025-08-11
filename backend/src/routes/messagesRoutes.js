import { Router } from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  listMessages,
  sendMessage,
  markAsRead,
  dashboardPreviews
} from "../controllers/messagesController.js";

const router = Router();

router.get("/", authenticateToken, listMessages);

router.get("/dashboard-previews", authenticateToken, dashboardPreviews);

router.post("/", authenticateToken, sendMessage);

router.post("/read", authenticateToken, markAsRead);

export default router;
