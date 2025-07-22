// src/models/planModel.js
import { db } from '../db.js'

export async function findAll() {
  const [rows] = await db.query(`
    SELECT id, name, description, price, benefits
      FROM plans
      ORDER BY price
  `)
  return rows
}
