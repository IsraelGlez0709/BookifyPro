// src/models/clientModel.js
import { db } from '../db.js';
import { v4 as uuidv4 } from 'uuid';

// Busca cliente por email o teléfono para un negocio
export async function findClientByEmailOrPhone(business_id, email, phone) {
  const [rows] = await db.query(
    `SELECT * FROM clients WHERE business_id = ? AND (email = ? OR phone = ?) LIMIT 1`,
    [business_id, email, phone]
  );
  return rows[0];
}

// Crea cliente
export async function createClient({ business_id, user_id = null, full_name, email, phone }) {
  const id = uuidv4();
  await db.query(
    `INSERT INTO clients (id, business_id, user_id, full_name, email, phone)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, business_id, user_id, full_name, email, phone]
  );
  return { id, business_id, user_id, full_name, email, phone };
}

export async function suggestClientsByEmail(business_id, query) {
  const [rows] = await db.query(
    `SELECT id, email, full_name, phone
     FROM clients
     WHERE business_id = ? AND email LIKE ? LIMIT 8`,
    [business_id, `%${query}%`]
  );
  return rows;
}

export async function listClients(business_id) {
  const [rows] = await db.query(
    `SELECT 
        c.id, c.business_id, c.user_id, c.full_name, c.email, c.phone, u.profile_photo
      FROM clients c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.business_id = ?
      ORDER BY c.created_at DESC`,
    [business_id]
  );
  return rows;
}

export async function findClientByUserId(business_id, user_id) {
  const [rows] = await db.query(
    `SELECT * FROM clients WHERE business_id = ? AND user_id = ? LIMIT 1`,
    [business_id, user_id]
  );
  return rows[0];
}

export async function createClientFromUser({ business_id, user }) {
  const id = uuidv4();
  await db.query(
    `INSERT INTO clients (id, business_id, user_id, full_name, email, phone)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      id,
      business_id,
      user?.id || null,
      user?.full_name || null,
      user?.email || null,
      user?.phone || null,
    ]
  );
  return { id, business_id, user_id: user?.id || null };
}

export async function ensureClientForUser(business_id, user) {
  const existing = await findClientByUserId(business_id, user.id);
  if (existing) return existing;
  return await createClientFromUser({ business_id, user });
}