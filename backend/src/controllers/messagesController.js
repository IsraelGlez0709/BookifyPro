// src/controllers/messagesController.js
import { db } from "../db.js";
import * as Conv from "../models/conversationsModel.js";
import * as Msg from "../models/messagesModel.js";

const ALLOWED_KINDS = new Set(["text", "image", "video", "audio", "document", "system"]);

function inferFileType(mime = "") {
  const m = (mime || "").toLowerCase();
  if (m.startsWith("image/")) return "image";
  if (m.startsWith("video/")) return "video";
  if (m.startsWith("audio/")) return "audio";
  return "document";
}
const coerceInt = v => (Number.isFinite(+v) ? +v : null);

export async function listMessages(req, res) {
  try {
    const authUserId = req.user.id;
    const { conversationId } = req.query;
    if (!conversationId) return res.status(400).json({ error: "conversationId requerido" });

    const canSee = await Conv.isUserInConversation(conversationId, authUserId);
    if (!canSee) return res.status(403).json({ error: "Sin acceso" });

    const limit = Math.min(parseInt(req.query.limit || "30", 10), 100);
    const cursor = req.query.cursor || null;

    const rows = await Msg.listMessagesPaged({ conversationId, cursor, limit });
    const nextCursor = Msg.computeNextCursor(rows, limit);

    res.json({ items: rows, nextCursor });
  } catch (err) {
    console.error("listMessages error", err);
    res.status(500).json({ error: "Error listando mensajes" });
  }
}

export async function sendMessage(req, res) {
  const conn = await db.getConnection();
  try {
    const authUserId = req.user.id;
    const {
      conversation_id,
      kind = "text",
      body = null,
      metadata = null,
      attachments = [],
      reply_to_message_id = null,
    } = req.body;

    if (!conversation_id) return res.status(400).json({ error: "conversation_id requerido" });

    const canSee = await Conv.isUserInConversation(conversation_id, authUserId);
    if (!canSee) return res.status(403).json({ error: "Sin acceso" });

    await conn.beginTransaction();

    const messageId = await Msg.insertMessage(conn, {
      conversation_id,
      sender_id: authUserId,
      kind,
      body,
      metadata,
      reply_to_message_id
    });

    await Msg.insertAttachments(conn, messageId, attachments);
    await conn.query(`UPDATE conversations SET updated_at=CURRENT_TIMESTAMP WHERE id=?`, [conversation_id]);

    await conn.commit();
    conn.release?.();

    // RESPONDER ya con attachments para que la UI tenga url/filename en caliente
    const msg = await Msg.getMessageWithAttachments(messageId);
    if (!msg) return res.status(201).json({ id: messageId }); // fallback raro, pero evita 500
    res.status(201).json(msg);
  } catch (err) {
    await (conn?.rollback?.());
    conn?.release?.();
    console.error("sendMessage error", err);
    res.status(500).json({ error: "Error enviando mensaje" });
  }
}

export async function markAsRead(req, res) {
  try {
    const authUserId = req.user.id;
    const { conversation_id, message_id } = req.body;
    if (!conversation_id || !message_id) {
      return res.status(400).json({ error: "conversation_id y message_id requeridos" });
    }

    const canSee = await Conv.isUserInConversation(conversation_id, authUserId);
    if (!canSee) return res.status(403).json({ error: "Sin acceso" });

    await Msg.upsertRead(message_id, authUserId);
    await Msg.updateLastRead(conversation_id, authUserId, message_id);

    res.json({ ok: true });
  } catch (err) {
    console.error("markAsRead error", err);
    res.status(500).json({ error: "Error marcando leído" });
  }
}

export async function dashboardPreviews(req, res) {
  try {
    const { business_id, limit } = req.query;
    if (!business_id) return res.status(400).json({ error: "business_id requerido" });

    const agent_user_id = req.user.id;

    const rows = await Msg.listCustomerPreviewsForDashboard(business_id, agent_user_id, limit);
    res.json(rows);
  } catch (err) {
    console.error("dashboardPreviews", err);
    res.status(500).json({ error: "Error listando mensajes" });
  }
}