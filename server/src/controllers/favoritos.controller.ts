import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

export const getFavoritos = async (req: AuthRequest, res: Response) => {
  if (!req.user || req.user.rol !== 'cliente') {
    throw new AppError('Only clientes can view favoritos', 403);
  }

  const favoritos = await prisma.favorito.findMany({
    where: { clienteId: req.user.id },
    include: {
      negocio: {
        include: {
          categoria: true,
          ciudad: true,
          fotos: {
            take: 1,
          },
          _count: {
            select: {
              reservas: true,
              resenas: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json({
    success: true,
    data: favoritos,
  });
};

export const toggleFavorito = async (req: AuthRequest, res: Response) => {
  if (!req.user || req.user.rol !== 'cliente') {
    throw new AppError('Only clientes can toggle favoritos', 403);
  }

  const { negocioId } = req.body;

  const existingFavorito = await prisma.favorito.findUnique({
    where: {
      clienteId_negocioId: {
        clienteId: req.user.id,
        negocioId: parseInt(negocioId),
      },
    },
  });

  if (existingFavorito) {
    await prisma.favorito.delete({
      where: { id: existingFavorito.id },
    });
    res.json({
      success: true,
      message: 'Favorito removed',
      data: { isFavorito: false },
    });
  } else {
    const favorito = await prisma.favorito.create({
      data: {
        clienteId: req.user.id,
        negocioId: parseInt(negocioId),
      },
    });
    res.json({
      success: true,
      message: 'Favorito added',
      data: { isFavorito: true, favorito },
    });
  }
};

