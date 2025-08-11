// src/models/packageModel.js
import { db } from "../db.js";

export async function createPackage({ id, business_id, name, description, price, photo }) {
  await db.query(
    `INSERT INTO packages (id, business_id, name, description, price, photo)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, business_id, name, description, price ?? null, photo ?? null]
  );
}

export async function updatePackage({ id, name, description, price, photo }) {
  if (photo !== undefined) {
    await db.query(
      `UPDATE packages
         SET name = ?, description = ?, price = ?, photo = ?
       WHERE id = ?`,
      [name, description, price ?? null, photo ?? null, id]
    );
  } else {
    await db.query(
      `UPDATE packages
         SET name = ?, description = ?, price = ?
       WHERE id = ?`,
      [name, description, price ?? null, id]
    );
  }
}

export async function deletePackage(id) {
  await db.query(`DELETE FROM packages WHERE id = ?`, [id]);
}

export async function findPackageById(id) {
  const [rows] = await db.query(`SELECT * FROM packages WHERE id = ?`, [id]);
  return rows[0] || null;
}

export async function listPackages(business_id) {
  const [rows] = await db.query(
    `SELECT * FROM packages WHERE business_id = ? ORDER BY created_at DESC`,
    [business_id]
  );
  return rows;
}
