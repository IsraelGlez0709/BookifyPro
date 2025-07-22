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
    `SELECT id, name, role, photo FROM specialists WHERE business_id = ?`,
    [business_id]
  );
  return rows;
}