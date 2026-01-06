import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import * as authService from '../services/auth.service';
import { AppError } from '../middleware/errorHandler';
import prisma from '../config/database';

export const register = async (req: AuthRequest, res: Response) => {
  const { nombre, apellido, email, password, telefono, ciudad, rol } = req.body;

  if (!nombre || !apellido || !email || !password) {
    throw new AppError('Missing required fields', 400);
  }

  const result = await authService.register({
    nombre,
    apellido,
    email,
    password,
    telefono,
    ciudad,
    rol,
  });

  res.status(201).json({
    success: true,
    data: result,
  });
};

export const login = async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email and password required', 400);
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







