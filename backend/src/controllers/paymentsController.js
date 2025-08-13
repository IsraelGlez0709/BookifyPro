// src/controllers/paymentsController.js
import { v4 as uuidv4 } from 'uuid';
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

import {
  createAppointment,
  updateAppointmentStatus,
  findAppointmentById
} from '../models/appointmentsModel.js';
import { findServiceById } from '../models/serviceModel.js';
import { findPackageById } from '../models/packageModel.js';
import {
  createPayment,
  updatePaymentStatusByAppointment,
  listRecentPaymentsByBusiness,
  monthlyRevenueByBusiness
} from '../models/paymentModel.js';
import * as UserModel from '../models/userModel.js';
import {
  ensureClientForUser,
  findClientByUserId,
} from '../models/clientsModel.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });

async function getAmountCentsFromSelection({ business_id, service_id, package_id }) {
  if (service_id) {
    const svc = await findServiceById(service_id);
    if (!svc || svc.business_id !== business_id) throw new Error('Servicio no encontrado');
    return Math.round(Number(svc.price || 0) * 100);
  }
  if (package_id) {
    const pkg = await findPackageById(package_id);
    if (!pkg || pkg.business_id !== business_id) throw new Error('Paquete no encontrado');
    return Math.round(Number(pkg.price || 0) * 100);
  }
  throw new Error('Debe enviarse service_id o package_id');
}

export async function createCheckoutSession(req, res) {
  try {
    const userId = req.user.id;
    const {
      business_id,
      specialist_id,
      service_id,
      package_id,
      date,
      start_time,
      notes = '',
    } = req.body;

    const user = await UserModel.findUserById(userId);
    if (user) {
      await ensureClientForUser(business_id, user);
    }

    // 1) Calcular monto desde BD
    const amount_cents = await getAmountCentsFromSelection({
      business_id,
      service_id,
      package_id,
    });

    // 2) Crear appointment en "pendiente"
    const appointment_id = uuidv4();
    await createAppointment({
      id: appointment_id,
      business_id,
      specialist_id,
      user_id: userId,
      service_id: service_id || null,
      package_id: package_id || null,
      date,
      start_time,
      end_time: null,
      status: 'pendiente',
      notes,
    });

    // 3) Crear sesión de Checkout
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      currency: 'mxn',
      line_items: [
        {
          price_data: {
            currency: 'mxn',
            product_data: {
              name: service_id ? 'Servicio' : 'Paquete',
              description: service_id ? 'Cita de servicio' : 'Cita de paquete',
            },
            unit_amount: amount_cents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        appointment_id,
        business_id,
        user_id: userId,
        type: service_id ? 'service' : 'package',
        service_id: service_id || '',
        package_id: package_id || '',
      },
      success_url: `${process.env.BASE_URL}/pago-exitoso?appointment_id=${appointment_id}`,
      cancel_url: `${process.env.BASE_URL}/pago-cancelado?appointment_id=${appointment_id}`,
    });

    // 4) Registrar pago en BD
    await createPayment({
      id: uuidv4(),
      appointment_id,
      business_id,
      user_id: userId,
      amount_cents,
      currency: 'mxn',
      provider: 'stripe',
      provider_payment_id: session.id,
      status: 'requires_payment',
    });

    res.json({ sessionId: session.id });
  } catch (err) {
    console.error('createCheckoutSession error', err);
    res.status(400).json({ error: err.message });
  }
}

export async function stripeWebhook(req, res) {
  let event;
  try {
    const sig = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('[stripe] signature failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('[stripe] event:', event.type, 'id:', event.id);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const appointment_id = session.metadata?.appointment_id;
        if (!appointment_id) break;

        const appt = await findAppointmentById(appointment_id);
        if (appt?.business_id && appt?.user_id) {
          const user = await UserModel.findUserById(appt.user_id);
          if (user) await ensureClientForUser(appt.business_id, user);
        }

        await updatePaymentStatusByAppointment(appointment_id, {
          status: 'succeeded',
          provider_payment_id: session.id,
        });
        await updateAppointmentStatus(appointment_id, 'confirmada');
        console.log('[stripe] cita confirmada por checkout.session.completed', appointment_id);
        break;
      }

      case 'payment_intent.succeeded': {
        const pi = event.data.object;
        const appointment_id = pi.metadata?.appointment_id;
        if (!appointment_id) break;

        await updatePaymentStatusByAppointment(appointment_id, {
          status: 'succeeded',
          provider_payment_id: pi.id,
        });
        await updateAppointmentStatus(appointment_id, 'confirmada');
        console.log('[stripe] cita confirmada por payment_intent.succeeded', appointment_id);
        break;
      }

      case 'checkout.session.expired':
      case 'checkout.session.async_payment_failed': {
        const session = event.data.object;
        const appointment_id = session.metadata?.appointment_id;
        if (!appointment_id) break;

        await updatePaymentStatusByAppointment(appointment_id, {
          status: 'failed',
          provider_payment_id: session.id,
        });
        await updateAppointmentStatus(appointment_id, 'cancelada');
        console.log('[stripe] cita cancelada por fallo de pago', appointment_id);
        break;
      }

      default:
        break;
    }

    return res.json({ received: true });
  } catch (err) {
    console.error('[stripe] handler error:', err);
    return res.status(500).send('Webhook handler error');
  }
}

export async function listRecentPayments(req, res) {
  try {
    const { business_id, limit } = req.query;
    if (!business_id) return res.status(400).json({ error: "Falta business_id" });

    const items = await listRecentPaymentsByBusiness(business_id, limit || 6);
    res.json(items);
  } catch (err) {
    console.error('listRecentPayments error', err);
    res.status(500).json({ error: "Error al obtener pagos" });
  }
}

export async function monthlyRevenue(req, res) {
  try {
    const { business_id, months = 8 } = req.query;
    if (!business_id) return res.status(400).json({ error: "Falta business_id" });

    const rows = await monthlyRevenueByBusiness(business_id, months);
    res.json(rows);
  } catch (err) {
    console.error('monthlyRevenue error', err);
    res.status(500).json({ error: "Error obteniendo ingresos mensuales" });
  }
}