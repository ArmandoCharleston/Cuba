import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

export const getServiciosByNegocio = async (req: AuthRequest, res: Response) => {
  const { negocioId } = req.params;

  const servicios = await prisma.servicio.findMany({
    where: {
      negocioId: parseInt(negocioId),
      activo: true,
    },
    orderBy: { nombre: 'asc' },
  });

  res.json({
    success: true,
    data: servicios,
  });
};

export const createServicio = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Not authenticated', 401);
  }

  const { negocioId } = req.params;
  const { nombre, descripcion, precio, duracion, categoria } = req.body;

  const negocio = await prisma.negocio.findUnique({
    where: { id: parseInt(negocioId) },
  });

  if (!negocio) {
    throw new AppError('Negocio not found', 404);
  }

  if (negocio.propietarioId !== req.user.id && req.user.rol !== 'admin') {
    throw new AppError('Not authorized', 403);
  }

  const servicio = await prisma.servicio.create({
    data: {
      negocioId: parseInt(negocioId),
      nombre,
      descripcion,
      precio: parseFloat(precio),
      duracion: parseInt(duracion),
      categoria,
    },
  });

  res.status(201).json({
    success: true,
    data: servicio,
  });
};

export const updateServicio = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Not authenticated', 401);
  }

  const { id } = req.params;

  const servicio = await prisma.servicio.findUnique({
    where: { id: parseInt(id) },
    include: {
      negocio: true,
    },
  });

  if (!servicio) {
    throw new AppError('Servicio not found', 404);
  }

  if (servicio.negocio.propietarioId !== req.user.id && req.user.rol !== 'admin') {
    throw new AppError('Not authorized', 403);
  }

  const updatedServicio = await prisma.servicio.update({
    where: { id: parseInt(id) },
    data: req.body,
  });

  res.json({
    success: true,
    data: updatedServicio,
  });
};

export const deleteServicio = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Not authenticated', 401);
  }

  const { id } = req.params;

  const servicio = await prisma.servicio.findUnique({
    where: { id: parseInt(id) },
    include: {
      negocio: true,
    },
  });

  if (!servicio) {
    throw new AppError('Servicio not found', 404);
  }

  if (servicio.negocio.propietarioId !== req.user.id && req.user.rol !== 'admin') {
    throw new AppError('Not authorized', 403);
  }

  await prisma.servicio.delete({
    where: { id: parseInt(id) },
  });

  res.json({
    success: true,
    message: 'Servicio deleted successfully',
  });
};


