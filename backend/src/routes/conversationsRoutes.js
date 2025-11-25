import { Router } from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  ensureConversation,
  getInbox,
  getConversationDetail,
  pinAppointment,
  unpinAppointment,
} from "../controllers/conversationsController.js";

const router = Router();

router.post("/ensure", authenticateToken, ensureConversation);

router.get("/mine", authenticateToken, getInbox);

router.get("/:id", authenticateToken, getConversationDetail);

router.patch("/:id/pin-appointment", authenticateToken, pinAppointment);
router.patch("/:id/unpin-appointment", authenticateToken, unpinAppointment);

export default router;
