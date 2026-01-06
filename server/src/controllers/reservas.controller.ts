import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

export const getReservas = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Not authenticated', 401);
  }

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (req.user.rol === 'cliente') {
    where.clienteId = req.user.id;
  } else if (req.user.rol === 'empresa') {
    where.negocio = {
      propietarioId: req.user.id,
    };
  }

  const [reservas, total] = await Promise.all([
    prisma.reserva.findMany({
      where,
      include: {
        cliente: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
            telefono: true,
          },
        },
        negocio: {
          select: {
            id: true,
            nombre: true,
            direccion: true,
            telefono: true,
          },
        },
        servicio: {
          select: {
            id: true,
            nombre: true,
            precio: true,
            duracion: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { fecha: 'desc' },
    }),
    prisma.reserva.count({ where }),
  ]);

  res.json({
    success: true,
    data: reservas,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
};

export const getReservaById = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Not authenticated', 401);
  }

  const { id } = req.params;

  const reserva = await prisma.reserva.findUnique({
    where: { id: parseInt(id) },
    include: {
      cliente: true,
      negocio: {
        include: {
          categoria: true,
          ciudad: true,
        },
      },
      servicio: true,
    },
  });

  if (!reserva) {
    throw new AppError('Reserva not found', 404);
  }

  if (
    reserva.clienteId !== req.user.id &&
    reserva.negocio.propietarioId !== req.user.id &&
    req.user.rol !== 'admin'
  ) {
    throw new AppError('Not authorized', 403);
  }

  res.json({
    success: true,
    data: reserva,
  });
};

export const createReserva = async (req: AuthRequest, res: Response) => {
  if (!req.user || req.user.rol !== 'cliente') {
    throw new AppError('Only clientes can create reservas', 403);
  }

  const { negocioId, servicioId, fecha, hora, notas, precioTotal } = req.body;

  const servicio = await prisma.servicio.findUnique({
    where: { id: parseInt(servicioId) },
    include: { negocio: true },
  });

  if (!servicio || servicio.negocioId !== parseInt(negocioId)) {
    throw new AppError('Servicio not found or invalid', 404);
  }

  const reserva = await prisma.reserva.create({
    data: {
      clienteId: req.user.id,
      negocioId: parseInt(negocioId),
      servicioId: parseInt(servicioId),
      fecha: new Date(fecha),
      hora,
      notas,
      precioTotal: precioTotal || servicio.precio,
      estado: 'pendiente',
    },
    include: {
      negocio: true,
      servicio: true,
    },
  });

  res.status(201).json({
    success: true,
    data: reserva,
  });
};

export const updateReservaEstado = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Not authenticated', 401);
  }

  const { id } = req.params;
  const { estado } = req.body;

  const reserva = await prisma.reserva.findUnique({
    where: { id: parseInt(id) },
    include: {
      negocio: true,
    },
  });

  if (!reserva) {
    throw new AppError('Reserva not found', 404);
  }

  if (
    reserva.clienteId !== req.user.id &&
    reserva.negocio.propietarioId !== req.user.id &&
    req.user.rol !== 'admin'
  ) {
    throw new AppError('Not authorized', 403);
  }

  const updatedReserva = await prisma.reserva.update({
    where: { id: parseInt(id) },
    data: { estado },
    include: {
      cliente: true,
      negocio: true,
      servicio: true,
    },
  });

  res.json({
    success: true,
    data: updatedReserva,
  });
};







