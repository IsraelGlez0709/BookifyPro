// src/routes/appointmentsRoutes.js
import { Router } from 'express';
import { createAppointment, listAppointmentsByBusiness, getAppointmentById, listAppointmentsForToday, getAvailability, deleteAppointment } from '../controllers/appointmentsController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticateToken, createAppointment);
router.get('/business/:id', authenticateToken, listAppointmentsByBusiness);
router.get("/today", listAppointmentsForToday);
router.get('/:businessId/availability', getAvailability);
router.get('/:id', getAppointmentById);
router.delete('/:id', authenticateToken, deleteAppointment);

export default router;
