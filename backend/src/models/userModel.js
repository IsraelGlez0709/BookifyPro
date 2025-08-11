// src/models/userModel.js
import { db } from '../db.js';

export async function findUserByEmail(email) {
  const [rows] = await db.query(`SELECT * FROM users WHERE email = ?`, [email]);
  return rows[0];
}

export async function findUserById(id) {
  const [rows] = await db.query(`SELECT * FROM users WHERE id = ?`, [id]);
  return rows[0];
}

export async function createUser({ id, full_name, phone, gender, profile_photo, dob, email, password_hash }) {
  await db.query(
    `INSERT INTO users (id, full_name, phone, gender, profile_photo, dob, email, password_hash)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, full_name, phone, gender, profile_photo, dob, email, password_hash]
  );
  return;
}

export async function searchUsersByEmail(emailPart) {
  const [rows] = await db.query(
    `SELECT id, full_name, email, phone FROM users WHERE email LIKE ? LIMIT 8`,
    [`%${emailPart}%`]
  );
  return rows;
}