// src/models/messagesModel.js
import { db } from "../db.js";
import { v4 as uuidv4 } from "uuid";

/**
 * Devuelve mensajes paginados por conversación, con attachments agregados.
 * MariaDB compat: usamos GROUP_CONCAT(JSON_OBJECT(...)) y parseamos en JS.
 */
export async function listMessagesPaged({ conversationId, cursor, limit }) {
  const params = [conversationId];
  let cursorSql = "";

  if (cursor) {
    // cursor = `${created_at_iso}|${id}`
    const [createdAtIso, id] = cursor.split("|");
    cursorSql = " AND (m.created_at < ? OR (m.created_at = ? AND m.id < ?)) ";
    params.push(createdAtIso, createdAtIso, id);
  }

  const sql = `
    SELECT
      m.*,
      GROUP_CONCAT(
        JSON_OBJECT(
          'id', a.id,
          'file_type', a.file_type,
          'file_url', a.file_url,
          'mime_type', a.mime_type,
          'size_bytes', a.size_bytes,
          'width', a.width,
          'height', a.height,
          'duration_ms', a.duration_ms
        )
        SEPARATOR '||'
      ) AS attachments_json
    FROM messages m
    LEFT JOIN message_attachments a ON a.message_id = m.id
    WHERE m.conversation_id = ?
    ${cursorSql}
    GROUP BY m.id
    ORDER BY m.created_at DESC, m.id DESC
    LIMIT ?
  `;
  params.push(limit);

  const [rows] = await db.query(sql, params);

  // DECORAR: parsear attachments_json -> attachments:[]
  const parsed = rows.map(r => {
    const out = { ...r };
    const s = r.attachments_json;
    if (s && typeof s === "string") {
      out.attachments = s
        .split("||")
        .filter(Boolean)
        .map(x => {
          try { return JSON.parse(x); } catch { return null; }
        })
        .filter(Boolean);
    } else {
      out.attachments = [];
    }
    delete out.attachments_json;
    return out;
  });

  // la consulta viene DESC; para la UI invertimos a ASC
  parsed.reverse();
  return parsed;
}

export function computeNextCursor(rows, limit) {
  if (rows.length < limit) return null;
  // después de reverse, el más antiguo quedó primero
  const first = rows[0];
  const createdAtIso =
    first.created_at instanceof Date ? first.created_at.toISOString() : first.created_at;
  return `${createdAtIso}|${first.id}`;
}

export async function insertMessage(conn, {
  conversation_id,
  sender_id,
  kind = "text",
  body = null,
  metadata = null,
  reply_to_message_id = null
}) {
  const id = uuidv4();
  await conn.query(
    `INSERT INTO messages (id, conversation_id, sender_id, kind, body, metadata, reply_to_message_id)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, conversation_id, sender_id, kind, body, metadata, reply_to_message_id]
  );
  return id;
}

export async function insertAttachments(conn, messageId, attachments = []) {
  if (!attachments?.length) return;
  const values = attachments.map(a => ([
    uuidv4(),
    messageId,
    a.file_type,
    a.file_url,
    a.mime_type || null,
    a.size_bytes ?? null,
    a.width ?? null,
    a.height ?? null,
    a.duration_ms ?? null,
  ]));
  await conn.query(
    `INSERT INTO message_attachments
      (id, message_id, file_type, file_url, mime_type, size_bytes, width, height, duration_ms)
     VALUES ?`,
    [values]
  );
}

/** Mensaje + attachments por id (para responder al crear) */
export async function getMessageWithAttachments(messageId) {
  const sql = `
    SELECT
      m.*,
      GROUP_CONCAT(
        JSON_OBJECT(
          'id', a.id,
          'file_type', a.file_type,
          'file_url', a.file_url,
          'mime_type', a.mime_type,
          'size_bytes', a.size_bytes,
          'width', a.width,
          'height', a.height,
          'duration_ms', a.duration_ms
        )
        SEPARATOR '||'
      ) AS attachments_json
    FROM messages m
    LEFT JOIN message_attachments a ON a.message_id = m.id
    WHERE m.id = ?
    GROUP BY m.id
    LIMIT 1
  `;
  const [rows] = await db.query(sql, [messageId]);
  if (!rows.length) return null;
  const r = rows[0];
  const out = { ...r };
  if (r.attachments_json) {
    out.attachments = r.attachments_json
      .split("||")
      .filter(Boolean)
      .map(s => { try { return JSON.parse(s); } catch { return null; } })
      .filter(Boolean);
  } else {
    out.attachments = [];
  }
  delete out.attachments_json;
  return out;
}

export async function upsertRead(messageId, userId) {
  await db.query(
    `INSERT INTO message_reads (message_id, user_id, read_at)
     VALUES (?, ?, CURRENT_TIMESTAMP)
     ON DUPLICATE KEY UPDATE read_at=VALUES(read_at)`,
    [messageId, userId]
  );
}

export async function updateLastRead(conversationId, userId, messageId) {
  await db.query(
    `UPDATE conversation_participants
     SET last_read_message_id = ?
     WHERE conversation_id=? AND user_id=?`,
    [messageId, conversationId, userId]
  );
}

export async function listCustomerPreviewsForDashboard(business_id, agent_user_id, limit = 8) {
  const [rows] = await db.query(
    `
    SELECT
      c.id                      AS conversation_id,
      u.id                      AS customer_user_id,
      u.full_name               AS customer_name,
      u.profile_photo           AS customer_photo,

      -- último mensaje por conversación
      lm.kind                   AS last_kind,
      CASE
        WHEN lm.kind = 'text'    THEN COALESCE(lm.body, '')
        WHEN lm.kind = 'image'   THEN '[Imagen]'
        WHEN lm.kind = 'video'   THEN '[Video]'
        WHEN lm.kind = 'audio'   THEN '[Audio]'
        WHEN lm.kind = 'document'THEN '[Documento]'
        WHEN lm.kind = 'contact' THEN '[Contacto]'
        ELSE '[Mensaje]'
      END                        AS last_text,
      lm.created_at             AS last_at,

      -- no leídos (solo mensajes del cliente después del last_read del agente)
      (
        SELECT COUNT(*)
        FROM messages mu
        WHERE mu.conversation_id = c.id
          AND mu.sender_id <> ?
          AND (
            cp_agent.last_read_message_id IS NULL
            OR mu.created_at > COALESCE(
                (SELECT mr.created_at FROM messages mr WHERE mr.id = cp_agent.last_read_message_id),
                '1970-01-01'
              )
          )
      ) AS unread_count

    FROM conversations c
    -- el "cliente" de la conversación (participant != agente)
    JOIN conversation_participants cp_cust
      ON cp_cust.conversation_id = c.id
    JOIN users u
      ON u.id = cp_cust.user_id

    -- el agente en esa conversación (para leer last_read)
    LEFT JOIN conversation_participants cp_agent
      ON cp_agent.conversation_id = c.id AND cp_agent.user_id = ?

    -- último mensaje por conversación
    LEFT JOIN (
      SELECT m1.*
      FROM messages m1
      JOIN (
        SELECT conversation_id, MAX(created_at) AS last_created
        FROM messages
        GROUP BY conversation_id
      ) lm1
        ON lm1.conversation_id = m1.conversation_id
       AND lm1.last_created     = m1.created_at
    ) lm
      ON lm.conversation_id = c.id

    WHERE c.type = 'business_support'
      AND c.business_id = ?
      AND cp_cust.user_id <> ?  -- evita que el agente sea tratado como cliente

    ORDER BY lm.created_at DESC, c.updated_at DESC
    LIMIT ?
    `,
    [
      agent_user_id,      // para unread: sender_id <> agente
      agent_user_id,      // cp_agent
      business_id,        // filtro negocio
      agent_user_id,      // excluir agente como "cliente"
      Number(limit) || 8, // límite
    ]
  );
  return rows;
}