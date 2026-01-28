import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

export const getAllMunicipios = async (req: AuthRequest, res: Response) => {
  const { provinciaId } = req.query;

  const where: any = {};
  if (provinciaId) {
    where.provinciaId = parseInt(provinciaId as string);
  }

  const municipios = await prisma.municipio.findMany({
    where,
    orderBy: { nombre: 'asc' },
    include: {
      provincia: {
        select: {
          id: true,
          nombre: true,
        },
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
    data: municipios,
  });
};

export const getMunicipioById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const municipio = await prisma.municipio.findUnique({
    where: { id: parseInt(id) },
    include: {
      provincia: true,
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

  if (!municipio) {
    throw new AppError('Municipio no encontrado', 404);
  }

  res.json({
    success: true,
    data: municipio,
  });
};


