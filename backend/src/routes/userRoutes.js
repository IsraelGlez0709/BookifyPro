import express from 'express';
import multer from 'multer';
import path from 'path';
import { registerUser, loginUser, me } from '../controllers/userController.js';
import { authenticateToken }    from '../middleware/auth.js';

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${file.fieldname}-${Date.now()}${ext}`;
    cb(null, name);
  }
});

const upload = multer({ storage });

router.post('/register', upload.single('profilePhoto'), registerUser);
router.post('/login',    loginUser);
router.get('/me',        authenticateToken, me);
export default router;
