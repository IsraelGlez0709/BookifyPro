// src/models/serviceFeatureModel.js
import { db } from '../db.js';
export async function createServiceFeature({ service_id, feature }) {
  await db.query(
    `INSERT INTO service_features (id, feature) VALUES (?, ?)`,
    [service_id, feature]
  );
}
export async function listServiceFeatures(service_id) {
  const [rows] = await db.query(
    `SELECT feature FROM service_features WHERE id = ?`,
    [service_id]
  );
  return rows.map(r => r.feature);
}