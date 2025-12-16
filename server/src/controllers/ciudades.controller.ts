import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../config/database';

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

