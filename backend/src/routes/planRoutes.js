// src/routes/planRoutes.js
import express from 'express';
import { getPlans } from '../controllers/planController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.get('/', authenticateToken, getPlans);
export default router;
