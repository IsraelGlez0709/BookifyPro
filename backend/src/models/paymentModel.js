// src/models/paymentModel.js
import { db } from '../db.js';

export async function createPayment({
  id,
  appointment_id,
  business_id,
  user_id,
  amount_cents,
  currency = 'mxn',
  provider = 'stripe',
  provider_payment_id = null,
  status = 'requires_payment',
}) {
  await db.query(
    `INSERT INTO payments
     (id, appointment_id, business_id, user_id, amount_cents, currency, provider, provider_payment_id, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      appointment_id,
      business_id,
      user_id,
      amount_cents,
      currency,
      provider,
      provider_payment_id,
      status,
    ],
  );
}

export async function updatePaymentStatusByAppointment(appointment_id, { status, provider_payment_id = null }) {
  await db.query(
    `UPDATE payments
     SET status = ?, provider_payment_id = COALESCE(?, provider_payment_id)
     WHERE appointment_id = ?`,
    [status, provider_payment_id, appointment_id],
  );
}

export async function findPaymentByAppointment(appointment_id) {
  const [rows] = await db.query(
    `SELECT * FROM payments WHERE appointment_id = ? LIMIT 1`,
    [appointment_id],
  );
  return rows[0] || null;
}

export async function listRecentPaymentsByBusiness(business_id, limit = 6) {
  const [rows] = await db.query(
    `
    SELECT
      p.id,
      p.business_id,
      p.user_id,
      p.amount_cents,
      p.currency,
      p.status,
      p.created_at,
      u.full_name AS customer_name,
      u.profile_photo AS customer_photo
    FROM payments p
    LEFT JOIN users u ON u.id = p.user_id
    WHERE p.business_id = ?
      AND p.status = 'succeeded'
    ORDER BY p.created_at DESC
    LIMIT ?
    `,
    [business_id, Number(limit) || 6]
  );
  return rows;
}

export async function monthlyRevenueByBusiness(business_id, months = 8) {
  const [rows] = await db.query(
    `
    SELECT
      DATE_FORMAT(created_at, '%Y-%m') AS ym,
      SUM(amount_cents) AS amount_cents
    FROM payments
    WHERE business_id = ?
      AND status = 'succeeded'
      AND created_at >= DATE_SUB(NOW(), INTERVAL ? MONTH)
    GROUP BY DATE_FORMAT(created_at, '%Y-%m')
    ORDER BY ym ASC
    `,
    [business_id, Number(months) || 8]
  );
  return rows;
}