// src/models/appointmentsModel.js
import { db } from '../db.js';
import { v4 as uuidv4 } from 'uuid';

export async function createAppointment({id, 
  business_id, specialist_id, user_id, service_id = null, package_id = null,
  date, start_time, end_time = null, status = 'pendiente', notes = null
}) {
  const appointmentId = id || uuidv4();
  await db.query(
    `INSERT INTO appointments
      (id, business_id, specialist_id, user_id, service_id, package_id, date, start_time, end_time, status, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [appointmentId, business_id, specialist_id, user_id, service_id, package_id, date, start_time, end_time, status, notes]
  );
  return { id: appointmentId };
}

export async function listAppointmentsByBusiness(business_id) {
  const [rows] = await db.query(
    `
    SELECT
      ap.id,
      ap.date,
      ap.start_time,
      ap.status,
      ap.notes,
      u.full_name AS cliente,
      s.name AS servicio,
      p.name AS paquete,
      sp.name AS especialista
    FROM appointments ap
    LEFT JOIN users u          ON u.id = ap.user_id
    LEFT JOIN services s       ON s.id = ap.service_id
    LEFT JOIN packages p       ON p.id = ap.package_id
    LEFT JOIN specialists sp   ON sp.id = ap.specialist_id
    WHERE ap.business_id = ?
    ORDER BY ap.date DESC, ap.start_time ASC
    `,
    [business_id]
  );
  return rows;
}

export async function updateAppointmentStatus(id, status) {
  await db.query(`UPDATE appointments SET status = ? WHERE id = ?`, [status, id]);
}

export async function findAppointmentById(id) {
  const [rows] = await db.query(
    `SELECT a.*,
            b.name       AS business_name,
            s.name       AS specialist_name,
            srv.name     AS service_name,
            pck.name     AS package_name
     FROM appointments a
     LEFT JOIN businesses b ON b.id = a.business_id
     LEFT JOIN specialists s ON s.id = a.specialist_id
     LEFT JOIN services   srv ON srv.id = a.service_id
     LEFT JOIN packages   pck ON pck.id = a.package_id
     WHERE a.id = ?
     LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

export async function listAppointmentsForToday(business_id) {
  const [rows] = await db.query(
    `
    SELECT
      ap.id,
      ap.date,
      ap.start_time,
      ap.status,
      u.full_name AS cliente,
      s.name      AS servicio,
      p.name      AS paquete,
      sp.name     AS especialista
    FROM appointments ap
    LEFT JOIN users       u  ON u.id  = ap.user_id
    LEFT JOIN services    s  ON s.id  = ap.service_id
    LEFT JOIN packages    p  ON p.id  = ap.package_id
    LEFT JOIN specialists sp ON sp.id = ap.specialist_id
    WHERE ap.business_id = ?
      AND ap.date = CURDATE()
    ORDER BY ap.start_time ASC
    `,
    [business_id]
  );
  return rows;
}

export async function findOccupiedSlots({ businessId, date, specialistId }) {
  let sql = `
    SELECT start_time
    FROM appointments
    WHERE business_id = ? AND date = ?
      AND status IN ('pendiente','confirmada')
  `;
  const args = [businessId, date];

  if (specialistId) {
    sql += ' AND specialist_id = ?';
    args.push(specialistId);
  }

  const [rows] = await db.query(sql, args);
  return rows.map(r => (typeof r.start_time === 'string'
    ? r.start_time.slice(0,5)
    : r.start_time.toString().slice(0,5)
  ));
}

export async function findScheduleForDay({ businessId, weekday }) {
  const [rows] = await db.query(
    `
    SELECT start_time AS \`from\`, end_time AS \`to\`
    FROM business_schedules
    WHERE business_id = ?
      AND LOWER(LEFT(
        REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(day,'á','a'),'é','e'),'í','i'),'ó','o'),'ú','u')
      ,3)) = ?
    LIMIT 1
    `,
    [businessId, weekday]
  );
  return rows[0] || null;
}
