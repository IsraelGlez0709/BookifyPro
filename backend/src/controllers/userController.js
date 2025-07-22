// src/controllers/userController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import * as User from '../models/userModel.js';
import dotenv from 'dotenv';
dotenv.config();

export async function registerUser(req, res) {
  try {
    console.log('=== multer file ===', req.file);
    const { full_name, phone, gender, dob, email, password } = req.body;
    const profilePhoto = req.file ? req.file.path : null;
    console.log('guardar en BD profilePhoto=', profilePhoto);
    if (await User.findUserByEmail(email)) {
      return res.status(409).json({ error: 'Email ya registrado' });
    }
    const password_hash = await bcrypt.hash(password, 10);
    const id = uuidv4();
    await User.createUser({ id, full_name, phone, gender, profile_photo: profilePhoto, dob, email, password_hash });
    res.status(201).json({ message: 'Usuario creado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByEmail(email);
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

    if (!await bcrypt.compare(password, user.password_hash)) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en login' });
  }
}

export async function me(req, res) {
  const user = await User.findUserByEmail(req.user.email);
  delete user.password_hash;
  res.json(user);
}
