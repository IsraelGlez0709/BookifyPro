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

// Crea o devuelve la conversación (DM o business_support)
router.post("/ensure", authenticateToken, ensureConversation);

// Listado de conversaciones del usuario (inbox)
router.get("/mine", authenticateToken, getInbox);

// Detalle de una conversación (display_name, participantes, etc.)
router.get("/:id", authenticateToken, getConversationDetail);

// (Opcional) Pin/Unpin de cita activa en el header de la conversación
router.patch("/:id/pin-appointment", authenticateToken, pinAppointment);
router.patch("/:id/unpin-appointment", authenticateToken, unpinAppointment);

export default router;
