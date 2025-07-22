// src/app.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import userRoutes     from './routes/userRoutes.js';
import businessRoutes from './routes/businessRoutes.js';
import planRoutes from './routes/planRoutes.js';
import { authenticateToken } from './middleware/auth.js';

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors())
app.use(express.json());

app.use('/api/plans', planRoutes);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/api/users', userRoutes);
app.use('/api/businesses', authenticateToken, businessRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 API escuchando en puerto ${PORT}`));
