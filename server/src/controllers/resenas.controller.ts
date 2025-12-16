import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

export const getResenasByNegocio = async (req: AuthRequest, res: Response) => {
  const { negocioId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const [resenas, total] = await Promise.all([
    prisma.resena.findMany({
      where: { negocioId: parseInt(negocioId) },
      include: {
        cliente: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            avatar: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.resena.count({ where: { negocioId: parseInt(negocioId) } }),
  ]);

  res.json({
    success: true,
    data: resenas,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
};

export const createResena = async (req: AuthRequest, res: Response) => {
  if (!req.user || req.user.rol !== 'cliente') {
    throw new AppError('Only clientes can create resenas', 403);
  }

  const { negocioId, reservaId, calificacion, comentario } = req.body;

  const existingResena = await prisma.resena.findFirst({
    where: {
      clienteId: req.user.id,
      negocioId: parseInt(negocioId),
      reservaId: reservaId ? parseInt(reservaId) : null,
    },
  });

  if (existingResena) {
    throw new AppError('Resena already exists', 400);
  }

  const resena = await prisma.resena.create({
    data: {
      clienteId: req.user.id,
      negocioId: parseInt(negocioId),
      reservaId: reservaId ? parseInt(reservaId) : null,
      calificacion: parseInt(calificacion),
      comentario,
    },
    include: {
      cliente: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
          avatar: true,
        },
      },
    },
  });

  const avgRating = await prisma.resena.aggregate({
    where: { negocioId: parseInt(negocioId) },
    _avg: { calificacion: true },
    _count: true,
  });

  await prisma.negocio.update({
    where: { id: parseInt(negocioId) },
    data: {
      calificacion: avgRating._avg.calificacion || 0,
      totalResenas: avgRating._count,
    },
  });

  res.status(201).json({
    success: true,
    data: resena,
  });
};


