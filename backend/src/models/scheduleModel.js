// src/models/scheduleModel.js
import { db } from '../db.js';
export async function createSchedule({ id, business_id, day, start_time, end_time }) {
  await db.query(
    `INSERT INTO business_schedules (id, business_id, day, start_time, end_time)
     VALUES (?, ?, ?, ?, ?)`,
    [id, business_id, day, start_time, end_time]
  );
}
export async function listSchedules(business_id) {
  const [rows] = await db.query(
    `SELECT day, start_time AS \`from\`, end_time AS \`to\`
       FROM business_schedules
      WHERE business_id = ?`,
    [business_id]
  );
  return rows;
}