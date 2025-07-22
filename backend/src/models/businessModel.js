// src/models/businessModel.js
import { db } from '../db.js';
export async function createBusiness({ id, user_id, name, type, address, about, plan_id }) {
  await db.query(
    `INSERT INTO businesses (id, user_id, name, type, address, about, plan_id)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, user_id, name, type, address, about, plan_id]
  );
}
export async function getBusinessesByUser(user_id) {
  const [rows] = await db.query(
    `SELECT * FROM businesses WHERE user_id = ? ORDER BY created_at DESC`,
    [user_id]
  );
  return rows;
}
export async function getBusinessById(business_id, user_id) {
  const [rows] = await db.query(
    `SELECT id, user_id, name, type, address, about, plan_id
       FROM businesses
      WHERE id = ? AND user_id = ?`,
    [business_id, user_id]
  );
  return rows[0];
}