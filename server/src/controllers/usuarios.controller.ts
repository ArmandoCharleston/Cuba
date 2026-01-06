import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

export const getProfile = async (req: AuthRequest, res: Response) => {
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

export const updateProfile = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Not authenticated', 401);
  }

  const { nombre, apellido, telefono, ciudad, avatar } = req.body;

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      nombre,
      apellido,
      telefono,
      ciudad,
      avatar,
    },
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







