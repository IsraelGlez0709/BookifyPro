// src/models/businessModel.js
import { db } from '../db.js';

export async function createBusiness({ 
    id, user_id, name, type, about, plan_id,
    address_street, address_ext_num, address_int_num, 
    address_colony, address_zip, address_city, address_state,
    latitude, longitude, categories
}) {
  const categoriesJson = categories ? JSON.stringify(categories) : '[]';
  await db.query(
    `INSERT INTO businesses (
        id, user_id, name, type, about, plan_id,
        address_street, address_ext_num, address_int_num, 
        address_colony, address_zip, address_city, address_state,
        latitude, longitude, categories
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
        id, user_id, name, type, about, plan_id,
        address_street, address_ext_num, address_int_num, 
        address_colony, address_zip, address_city, address_state,
        latitude, longitude, categoriesJson
    ]
  );
}

export async function getBusinessById(business_id) {
  const [rows] = await db.query(
    `SELECT 
        id, user_id, name, type, about, plan_id, logo,
        address_street, address_ext_num, address_int_num,
        address_colony, address_zip, address_city, address_state,
        latitude, longitude,
        phone_numbers, social_links, categories
     FROM businesses
     WHERE id = ?`,
    [business_id]
  );
  return rows[0];
}

export async function getAllBusinesses() {
  const [rows] = await db.query(
    `SELECT * FROM businesses ORDER BY created_at DESC`
  );
  return rows;
}

export async function getBusinessesByUser(user_id) {
  const [rows] = await db.query(
    `SELECT * FROM businesses WHERE user_id = ? ORDER BY created_at DESC`,
    [user_id]
  );
  return rows;
}

export async function updateBusinessModel(id, data) {
  const fields = [];
  const values = [];

  Object.keys(data).forEach(key => {
    if (data[key] !== undefined) {
      fields.push(`${key} = ?`);
      if (typeof data[key] === 'object' && data[key] !== null) {
         values.push(JSON.stringify(data[key]));
      } else {
         values.push(data[key]);
      }
    }
  });

  values.push(id);

  const query = `UPDATE businesses SET ${fields.join(", ")} WHERE id = ?`;
  await db.query(query, values);
}