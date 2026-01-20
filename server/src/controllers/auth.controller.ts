import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import * as authService from '../services/auth.service';
import { AppError } from '../middleware/errorHandler';
import prisma from '../config/database';

export const register = async (req: AuthRequest, res: Response) => {
  const { nombre, apellido, email, password, telefono, ciudad, rol } = req.body;

  if (!nombre || !apellido || !email || !password) {
    throw new AppError('Faltan campos requeridos: nombre, apellido, email y contraseña son obligatorios', 400);
  }

  // Prevenir creación de usuarios admin desde el registro público
  if (rol === 'admin') {
    throw new AppError('No se puede crear un usuario administrador desde el registro público', 403);
  }

  const result = await authService.register({
    nombre,
    apellido,
    email,
    password,
    telefono: telefono || undefined,
    ciudad: ciudad || undefined,
    rol: rol === 'empresa' ? 'empresa' : 'cliente', // Solo permitir cliente o empresa
  });

  res.status(201).json({
    success: true,
    data: result,
  });
};

export const login = async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('El correo electrónico y la contraseña son requeridos', 400);
  }

  const result = await authService.login({ email, password });

  res.json({
    success: true,
    data: result,
  });
};

export const getMe = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Not authenticated', 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      nombre: true,
      apellido: true,
      email: true,
      telefono: true,
      ciudad: true,
      rol: true,
      avatar: true,
      createdAt: true,
    },
  });

  res.json({
    success: true,
    data: user,
  });
};







