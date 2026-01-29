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

  // Validar campos requeridos si se proporcionan
  if (nombre !== undefined && (!nombre || nombre.trim().length === 0)) {
    throw new AppError('El nombre no puede estar vacío', 400);
  }

  if (apellido !== undefined && (!apellido || apellido.trim().length === 0)) {
    throw new AppError('El apellido no puede estar vacío', 400);
  }

  // Preparar datos para actualización (solo incluir campos definidos)
  const updateData: {
    nombre?: string;
    apellido?: string;
    telefono?: string | null;
    ciudad?: string | null;
    avatar?: string | null;
  } = {};

  if (nombre !== undefined) updateData.nombre = nombre.trim();
  if (apellido !== undefined) updateData.apellido = apellido.trim();
  if (telefono !== undefined) updateData.telefono = telefono?.trim() || null;
  if (ciudad !== undefined) updateData.ciudad = ciudad?.trim() || null;
  // Avatar puede ser null, string vacío (convertir a null), o un valor válido
  if (avatar !== undefined) {
    updateData.avatar = avatar && avatar.trim().length > 0 ? avatar.trim() : null;
  }

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: updateData,
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







