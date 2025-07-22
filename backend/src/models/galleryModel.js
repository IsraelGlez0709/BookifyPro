// src/models/galleryModel.js
import { db } from '../db.js';
export async function createGalleryItem({ id, business_id, file_url }) {
  await db.query(
    `INSERT INTO gallery_images (id, business_id, file_url) VALUES (?, ?, ?)`,
    [id, business_id, file_url]
  );
}
export async function listGallery(business_id) {
  const [rows] = await db.query(
    `SELECT file_url FROM gallery_images WHERE business_id = ?`,
    [business_id]
  );
  return rows.map(r => r.file_url);
}