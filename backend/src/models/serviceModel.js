// src/models/serviceModel.js
import { db } from '../db.js';
export async function createService({ id, business_id, name }) {
  await db.query(
    `INSERT INTO services (id, business_id, name) VALUES (?, ?, ?)`,
    [id, business_id, name]
  );
}
export async function listServices(business_id) {
  const [rows] = await db.query(
    `SELECT id, name FROM services WHERE business_id = ?`,
    [business_id]
  );
  return rows;
}