// src/routes/clientsRoutes.js
import { Router } from 'express';
import { suggestClients, listClients, createClient } from '../controllers/clientsController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/clients/suggest', suggestClients);

router.get('/', authenticateToken, listClients);

router.post('/', authenticateToken, createClient);

export default router;
