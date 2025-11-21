import "dotenv/config";
import cron from "node-cron";
import mysql from "mysql2/promise";

const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASS,
  DB_NAME,
  DEFAULT_TZ = "America/Mexico_City",
} = process.env;

const OFFSETS_MINUTES = [1]; //[1440, 180, 60];

const pool = await mysql.createPool({
  host: DB_HOST,
  port: DB_PORT ? Number(DB_PORT) : 3306,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  connectionLimit: 10,
  dateStrings: true,
});

function fmtFecha(date) {
  const dias = [
    "domingo",
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
  ];
  const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  return `${dias[date.getDay()]}, ${date.getDate()} de ${
    meses[date.getMonth()]
  } de ${date.getFullYear()}`;
}

function fmtHora(date) {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

async function getDueAppointmentsForOffset(offsetMinutes) {
  const low = offsetMinutes - 2;
  const high = offsetMinutes + 2;

  const [rows] = await pool.query(
    `
    SELECT
      a.id,
      a.business_id,
      a.user_id,
      a.date,
      a.start_time,
      a.status,
      b.name AS business_name,
      c.full_name AS client_name,
      c.phone AS client_phone
    FROM appointments a
    JOIN businesses b ON b.id = a.business_id
    LEFT JOIN clients c
      ON c.user_id = a.user_id
     AND c.business_id = a.business_id
    WHERE a.status IN ('confirmada','CONFIRMADA','confirmed')
      AND c.phone IS NOT NULL AND c.phone <> ''
      AND TIMESTAMP(a.date, a.start_time)
          BETWEEN DATE_ADD(NOW(), INTERVAL ? MINUTE)
              AND DATE_ADD(NOW(), INTERVAL ? MINUTE)
      AND NOT EXISTS (
        SELECT 1 FROM reminder_log rl
         WHERE rl.appointment_id = a.id
           AND rl.channel = 'mock'
           AND rl.offset_minutes = ?
      )
    `,
    [low, high, offsetMinutes]
  );

  console.log(
    `[DEBUG] offset=${offsetMinutes} low=${low} high=${high} -> due=${rows.length}`
  );
  return rows;
}

async function markLog(apptId, offsetMinutes, status, errorText = null) {
  await pool.query(
    `INSERT INTO reminder_log (appointment_id, channel, offset_minutes, sent_at, status, error_text)
     VALUES (?, 'mock', ?, NOW(), ?, ?)
     ON DUPLICATE KEY UPDATE sent_at=VALUES(sent_at), status=VALUES(status), error_text=VALUES(error_text)`,
    [apptId, offsetMinutes, status, errorText]
  );
}

function toLocalDate(dateStr, timeStr) {
  const d = String(dateStr ?? "")
    .trim()
    .slice(0, 10);
  const [Y, M, D] = d.split("-").map((n) => parseInt(n, 10));

  const rawT = String(timeStr ?? "").trim();
  const t = rawT.includes(":") ? rawT.slice(0, 8) : "00:00:00";
  const [h, m, s] = t.split(":").map((n) => parseInt(n || "0", 10));

  return new Date(Y, (M || 1) - 1, D || 1, h || 0, m || 0, s || 0, 0);
}

async function sendMock(appt, offsetMinutes) {
  const startLocal = toLocalDate(appt.date, appt.start_time);
  console.log("[DEBUG DATE RAW]", appt.date, appt.start_time);
  console.log("[DEBUG DATE ISO]", startLocal.toISOString());

  if (isNaN(startLocal.getTime())) {
    console.error(
      "[DEBUG] Fecha inválida tras normalizar:",
      appt.date,
      appt.start_time
    );
  }
  const fecha = fmtFecha(startLocal);
  const hora = fmtHora(startLocal);

  const preview = `[MOCK WhatsApp] → ${appt.client_name ?? "Cliente"} (${
    appt.client_phone
  })
Negocio: ${appt.business_name ?? "Tu negocio"}
Fecha: ${fecha}
Hora: ${hora} (local)
Mensaje: "Hola ${appt.client_name ?? ""}. Recordatorio de tu cita en ${
    appt.business_name ?? "tu negocio"
  } el ${fecha} a las ${hora}."`;

  try {
    console.log(preview);
    await markLog(appt.id, offsetMinutes, "SENT", null);
  } catch (e) {
    console.error("[MOCK ERROR]", e?.message ?? e);
    await markLog(appt.id, offsetMinutes, "FAILED", String(e?.message ?? e));
  }
}

async function runCycle() {
  for (const offset of OFFSETS_MINUTES) {
    const dues = await getDueAppointmentsForOffset(offset);
    if (!dues.length)
      console.log(`[DEBUG] No hay citas due para offset=${offset}`);
    for (const appt of dues) {
      await sendMock(appt, offset);
    }
  }
}

const runOnce = process.argv.includes("--run-once");
if (runOnce) {
  await runCycle();
  process.exit(0);
} else {
  console.log("Recordatorios (modo local/mock) activos: cada minuto");
  cron.schedule("*/1 * * * *", async () => {
    try {
      await runCycle();
    } catch (e) {
      console.error("Error ciclo:", e);
    }
  });
}
