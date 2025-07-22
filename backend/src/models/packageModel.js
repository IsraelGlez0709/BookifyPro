// src/models/packageModel.js
import { db } from '../db.js';
export async function createPackage({ id, business_id, name, description, price, photo }) {
  await db.query(
    `INSERT INTO packages (id, business_id, name, description, price, photo)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, business_id, name, description, price, photo]
  );
}
export async function listPackages(business_id) {
  const [rows] = await db.query(
    `SELECT id, name, description, price, photo FROM packages WHERE business_id = ?`,
    [business_id]
  );
  return rows;
}