// src/models/conversationsModel.js
import { db } from "../db.js";
import { v4 as uuidv4 } from "uuid";

export async function findConversationById(id) {
  const [rows] = await db.query(`SELECT * FROM conversations WHERE id=? LIMIT 1`, [id]);
  return rows[0] || null;
}

export async function isUserInConversation(conversationId, userId) {
  const [rows] = await db.query(
    `SELECT 1 FROM conversation_participants WHERE conversation_id=? AND user_id=? LIMIT 1`,
    [conversationId, userId]
  );
  return rows.length > 0;
}

export async function findBusinessSupportForUser(businessId, userId) {
  const [rows] = await db.query(
    `
    SELECT c.*
    FROM conversations c
    JOIN conversation_participants cp ON cp.conversation_id = c.id
    WHERE c.type='business_support' AND c.business_id=? AND cp.user_id=?
    LIMIT 1
    `,
    [businessId, userId]
  );
  return rows[0] || null;
}

export async function createBusinessSupportConversation({ businessId, createdBy }) {
  const id = uuidv4();
  await db.query(
    `INSERT INTO conversations (id, type, business_id, created_by)
     VALUES (?, 'business_support', ?, ?)`,
    [id, businessId, createdBy]
  );
  return id;
}

export async function addParticipant(conversationId, userId, role = "member") {
  await db.query(
    `INSERT IGNORE INTO conversation_participants (conversation_id, user_id, role)
     VALUES (?, ?, ?)`,
    [conversationId, userId, role]
  );
}

export async function findBusinessOwnerUserId(businessId) {
  const [rows] = await db.query(
    `SELECT user_id FROM businesses WHERE id=? LIMIT 1`,
    [businessId]
  );
  return rows[0]?.user_id || null;
}

export async function findDirectBetween(userA, userB) {
  const [rows] = await db.query(
    `
    SELECT c.*
    FROM conversations c
    WHERE c.type='direct'
      AND EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id=c.id AND user_id=?)
      AND EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id=c.id AND user_id=?)
      AND (SELECT COUNT(*) FROM conversation_participants WHERE conversation_id=c.id) = 2
    LIMIT 1
    `,
    [userA, userB]
  );
  return rows[0] || null;
}

export async function createDirectConversation(createdBy) {
  const id = uuidv4();
  await db.query(
    `INSERT INTO conversations (id, type, created_by) VALUES (?, 'direct', ?)`,
    [id, createdBy]
  );
  return id;
}

export async function getInboxRows(userId, limit = 50) {
  const [rows] = await db.query(
    `
    SELECT
      c.id,
      c.type,
      c.business_id,
      c.updated_at,
      CASE
        WHEN c.type='business_support'
             AND EXISTS (
               SELECT 1 FROM conversation_participants cp2
               WHERE cp2.conversation_id = c.id
                 AND cp2.user_id = ?
                 AND cp2.role = 'agent'
             )
        THEN (
          SELECT u.full_name
          FROM conversation_participants cp3
          JOIN users u ON u.id = cp3.user_id
          WHERE cp3.conversation_id = c.id AND cp3.user_id <> ?
          ORDER BY cp3.user_id <> ? DESC
          LIMIT 1
        )
        WHEN c.type='business_support' THEN b.name
        WHEN c.type='group' THEN c.title
        ELSE (
          SELECT u.full_name
          FROM conversation_participants cp2
          JOIN users u ON u.id = cp2.user_id
          WHERE cp2.conversation_id = c.id AND cp2.user_id <> ?
          LIMIT 1
        )
      END AS display_name
    FROM conversations c
    LEFT JOIN businesses b ON b.id = c.business_id
    JOIN conversation_participants cp ON cp.conversation_id = c.id AND cp.user_id = ?
    ORDER BY c.updated_at DESC
    LIMIT ?
    `,
    [userId, userId, userId, userId, userId, limit]
  );
  return rows;
}

export async function getParticipants(conversationId) {
  const [rows] = await db.query(
    `
    SELECT cp.user_id, cp.role, u.full_name, u.profile_photo
    FROM conversation_participants cp
    JOIN users u ON u.id = cp.user_id
    WHERE cp.conversation_id = ?
    `,
    [conversationId]
  );
  return rows;
}

export async function getBusinessBasic(businessId) {
  if (!businessId) return null;
  const [rows] = await db.query(
    `SELECT id, name, logo FROM businesses WHERE id=? LIMIT 1`,
    [businessId]
  );
  return rows[0] || null;
}

export async function updatePinnedAppointment(conversationId, appointmentIdOrNull) {
  await db.query(
    `UPDATE conversations SET appointment_id=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
    [appointmentIdOrNull, conversationId]
  );
}

export async function touchConversation(conversationId) {
  await db.query(`UPDATE conversations SET updated_at=CURRENT_TIMESTAMP WHERE id=?`, [conversationId]);
}

export async function ensureBusinessSupportConversation(businessId, customerUserId, createdBy) {
  let [rows] = await db.query(
    `SELECT * FROM conversations 
     WHERE type='business_support' AND business_id=? AND customer_user_id=?
     LIMIT 1`,
    [businessId, customerUserId]
  );
  if (rows[0]) return rows[0];

  const id = uuidv4();

  await db.query(
    `INSERT IGNORE INTO conversations (id, type, business_id, customer_user_id, created_by)
     VALUES (?, 'business_support', ?, ?, ?)`,
    [id, businessId, customerUserId, createdBy]
  );

  [rows] = await db.query(
    `SELECT * FROM conversations 
     WHERE type='business_support' AND business_id=? AND customer_user_id=?
     LIMIT 1`,
    [businessId, customerUserId]
  );
  return rows[0];
}

export async function ensureDirectConversation(userA, userB) {
  const existing = await findDirectBetween(userA, userB);
  if (existing) return existing;

  const convId = await createDirectConversation(userA);

  await addParticipant(convId, userA, "member");
  await addParticipant(convId, userB, "member");

  return await findConversationById(convId);
}

export async function touchConversationTx(conn, conversationId) {
  await conn.query(
    `UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [conversationId]
  );
}

export async function getUserBasic(userId) {
  const [rows] = await db.query(
    `SELECT id, full_name, profile_photo FROM users WHERE id=? LIMIT 1`,
    [userId]
  );
  return rows[0] || null;
}

export async function getBusinessPrimaryImage(businessId) {
  const [rows] = await db.query(
    `
    SELECT image_url
    FROM gallery_images
    WHERE business_id=?
    ORDER BY
      -- si tienes una bandera tipo is_cover / is_primary, ponla arriba
      position IS NULL, position ASC,
      created_at ASC
    LIMIT 1
    `,
    [businessId]
  );
  return rows[0]?.image_url || null;
}