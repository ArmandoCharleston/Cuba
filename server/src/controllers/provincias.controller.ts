import { Request, Response } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

export const getAllProvincias = async (req: Request, res: Response) => {
  const provincias = await prisma.provincia.findMany({
    orderBy: { nombre: 'asc' },
    include: {
      municipios: {
        orderBy: { nombre: 'asc' },
      },
      _count: {
        select: {
          negocios: {
            where: {
              estado: 'aprobada',
            },
          },
        },
      },
    },
  });

  res.json({
    success: true,
    data: provincias,
  });
};

export const getProvinciaById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const provincia = await prisma.provincia.findUnique({
    where: { id: parseInt(id) },
    include: {
      municipios: {
        orderBy: { nombre: 'asc' },
        include: {
          _count: {
            select: {
              negocios: {
                where: {
                  estado: 'aprobada',
                },
              },
            },
          },
        },
      },
    },
  });

  if (!provincia) {
    throw new AppError('Provincia no encontrada', 404);
  }

  res.json({
    success: true,
    data: provincia,
  });
};



