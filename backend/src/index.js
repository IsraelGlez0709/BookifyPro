// src/index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import userRoutes from './routes/userRoutes.js';
import businessRoutes from './routes/businessRoutes.js';
import planRoutes from './routes/planRoutes.js';
import appointmentsRoutes from './routes/appointmentsRoutes.js';
import clientsRoutes from './routes/clientsRoutes.js';
import paymentsRoutes from './routes/paymentsRoutes.js';
import conversationsRoutes from "./routes/conversationsRoutes.js";
import messagesRoutes from "./routes/messagesRoutes.js";
import uploadsRoutes from "./routes/uploadsRoutes.js";
import metricsRoutes from "./routes/metricsRoutes.js";
import { authenticateToken } from './middleware/auth.js';

import { stripeWebhook } from './controllers/paymentsController.js';

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.post(
  '/api/payments/webhooks/stripe',
  express.raw({ type: 'application/json' }),
  stripeWebhook
);

app.use(cors());
app.use(express.json());

// estáticos
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// rutas
app.use('/api/plans', planRoutes);
app.use('/api/users', userRoutes);
app.use('/api/businesses', authenticateToken, businessRoutes);
app.use('/api/appointments', authenticateToken, appointmentsRoutes);
app.use('/api/clients', clientsRoutes);
app.use("/api/conversations", conversationsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/uploads", uploadsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use("/api/metrics", authenticateToken, metricsRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API escuchando en puerto ${PORT}`));
