import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../config/database';

export const getAllCategorias = async (req: AuthRequest, res: Response) => {
  const categorias = await prisma.categoria.findMany({
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
    data: categorias,
  });
};

export const getCategoriaById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const categoria = await prisma.categoria.findUnique({
    where: { id: parseInt(id) },
    include: {
      negocios: {
        include: {
          ciudad: true,
          _count: {
            select: {
              reservas: true,
              resenas: true,
            },
          },
        },
      },
    },
  });

  res.json({
    success: true,
    data: categoria,
  });
};


