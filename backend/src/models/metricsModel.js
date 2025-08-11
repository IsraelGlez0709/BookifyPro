// src/models/metricsModel.js
import { db } from "../db.js";

export async function getOverview(business_id) {
  const [rows] = await db.query(
    `
    SELECT
      (SELECT COUNT(*) FROM clients c WHERE c.business_id = ?) AS total_clients,
      (SELECT COUNT(*) FROM appointments a WHERE a.business_id = ?) AS total_appointments,
      (SELECT COUNT(*) FROM appointments a WHERE a.business_id = ? AND a.status = 'completada') AS total_completed
    `,
    [business_id, business_id, business_id]
  );
  return rows[0] || { total_clients: 0, total_appointments: 0, total_completed: 0 };
}
