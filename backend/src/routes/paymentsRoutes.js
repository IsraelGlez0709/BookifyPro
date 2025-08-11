// src/routes/paymentsRoutes.js
import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { createCheckoutSession, stripeWebhook, listRecentPayments, monthlyRevenue } from '../controllers/paymentsController.js';

const router = Router();

router.post('/appointments/checkout', authenticateToken, createCheckoutSession);
router.get("/recent", authenticateToken, listRecentPayments);
router.get("/revenue/monthly", authenticateToken, monthlyRevenue);
router.post('/webhooks/stripe', stripeWebhook);

export default router;
