// src/models/specialistModel.js
import { db } from '../db.js';

export async function createSpecialist({ id, business_id, name, role, photo }) {
  await db.query(
    `INSERT INTO specialists (id, business_id, name, role, photo) VALUES (?, ?, ?, ?, ?)`,
    [id, business_id, name, role, photo]
  );
}
export async function listSpecialists(business_id) {
  const [rows] = await db.query(
    `SELECT id, name, role, photo, status FROM specialists WHERE business_id = ? AND status = 'active'`,
    [business_id]
  );
  return rows;
}

export async function updateSpecialist({ id, name, role, photo, status }) {
  await db.query(
    `UPDATE specialists SET name = ?, role = ?, photo = ?, status = ? WHERE id = ?`,
    [name, role, photo, status, id]
  );
}

export async function deactivateSpecialist(id, status) {
  await db.query(`UPDATE specialists SET status = ? WHERE id = ?`, [status, id]);
}