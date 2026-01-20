import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

export const getAllCiudades = async (req: AuthRequest, res: Response) => {
  const ciudades = await prisma.ciudad.findMany({
    orderBy: { nombre: 'asc' },
    include: {
      _count: {
        select: {
          negocios: true,
        },
      },
    },
  });

  res.json({
    success: true,
    data: ciudades,
  });
};

export const createCiudad = async (req: AuthRequest, res: Response) => {
  const { nombre } = req.body;

  if (!nombre) {
    throw new AppError('Nombre es requerido', 400);
  }

  const ciudad = await prisma.ciudad.create({
    data: {
      nombre,
    },
  });

  res.status(201).json({
    success: true,
    data: ciudad,
  });
};

