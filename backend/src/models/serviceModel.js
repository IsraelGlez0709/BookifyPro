// src/models/serviceModel.js
import { db } from '../db.js';

export async function createService({ id, business_id, name, price }) {
  const p = (price === undefined || price === null || price === '')
    ? null
    : Number(String(price).replace(',', '.'));
  await db.query(
    `INSERT INTO services (id, business_id, name, price) VALUES (?, ?, ?, ?)`,
    [id, business_id, name, p]
  );
}
export async function listServices(business_id) {
  const [rows] = await db.query(
    `SELECT id, name, price, status FROM services WHERE business_id = ? AND status = 'active'`,
    [business_id]
  );
  return rows;
}

export async function updateService({ id, name, price, status }) {
  await db.query(
    `UPDATE services SET name = ?, price = ?, status = ? WHERE id = ?`,
    [name, price, status, id]
  );
}

export async function deactivateService(id, status) {
  await db.query(`UPDATE services SET status = ? WHERE id = ?`, [status, id]);
}

export async function findServiceById(id) {
  const [rows] = await db.query(`SELECT * FROM services WHERE id = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

export async function deleteService(id) {
  await db.query(`DELETE FROM services WHERE id = ?`, [id]);
}