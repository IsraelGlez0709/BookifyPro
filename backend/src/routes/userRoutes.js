import express from 'express';
import multer from 'multer';
import { storage } from '../config/cloudinary.js';
import { registerUser, loginUser, me, searchUsersByEmail } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

const upload = multer({ storage });

router.post('/register', upload.single('profilePhoto'), registerUser);
router.post('/login', loginUser);
router.get('/me', authenticateToken, me);
router.get('/search', searchUsersByEmail);

export default router;