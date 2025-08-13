// src/routes/appointmentsRoutes.js
import { Router } from 'express';
import { createAppointment, listAppointmentsByBusiness, getAppointmentById, listAppointmentsForToday } from '../controllers/appointmentsController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticateToken, createAppointment);
router.get('/business/:id', authenticateToken, listAppointmentsByBusiness);
router.get("/today", listAppointmentsForToday);
router.get('/:id', getAppointmentById);
router.get('/:businessId/availability', getAvailability);

export default router;
