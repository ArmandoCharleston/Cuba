import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

export const getAllNegocios = async (req: AuthRequest, res: Response) => {
  const { categoriaId, ciudadId, search } = req.query;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (categoriaId) {
    where.categoriaId = parseInt(categoriaId as string);
  }

  if (ciudadId) {
    where.ciudadId = parseInt(ciudadId as string);
  }

  if (search) {
    where.OR = [
      { nombre: { contains: search as string } },
      { descripcion: { contains: search as string } },
    ];
  }

  const [negocios, total] = await Promise.all([
    prisma.negocio.findMany({
      where,
      include: {
        categoria: true,
        ciudad: true,
        propietario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
          },
        },
        fotos: {
          orderBy: { orden: 'asc' },
        },
        _count: {
          select: {
            reservas: true,
            resenas: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.negocio.count({ where }),
  ]);

  res.json({
    success: true,
    data: negocios,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
};

export const getNegocioById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const negocio = await prisma.negocio.findUnique({
    where: { id: parseInt(id) },
    include: {
      categoria: true,
      ciudad: true,
      propietario: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
          email: true,
          telefono: true,
        },
      },
      servicios: {
        where: { activo: true },
      },
      fotos: {
        orderBy: { orden: 'asc' },
      },
      resenas: {
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
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      _count: {
        select: {
          reservas: true,
          resenas: true,
        },
      },
    },
  });

  if (!negocio) {
    throw new AppError('Negocio not found', 404);
  }

  res.json({
    success: true,
    data: negocio,
  });
};

export const createNegocio = async (req: AuthRequest, res: Response) => {
  if (!req.user || req.user.rol !== 'empresa') {
    throw new AppError('Only empresas can create negocios', 403);
  }

  const {
    nombre,
    direccion,
    telefono,
    email,
    descripcion,
    categoriaId,
    ciudadId,
    foto,
    horarios,
    precioPromedio,
  } = req.body;

  const negocio = await prisma.negocio.create({
    data: {
      nombre,
      direccion,
      telefono,
      email,
      descripcion,
      categoriaId: parseInt(categoriaId),
      ciudadId: parseInt(ciudadId),
      propietarioId: req.user.id,
      foto,
      horarios: horarios || {},
      precioPromedio: precioPromedio || 0,
    },
    include: {
      categoria: true,
      ciudad: true,
    },
  });

  res.status(201).json({
    success: true,
    data: negocio,
  });
};

export const updateNegocio = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Not authenticated', 401);
  }

  const { id } = req.params;

  const negocio = await prisma.negocio.findUnique({
    where: { id: parseInt(id) },
  });

  if (!negocio) {
    throw new AppError('Negocio not found', 404);
  }

  if (negocio.propietarioId !== req.user.id && req.user.rol !== 'admin') {
    throw new AppError('Not authorized', 403);
  }

  const updatedNegocio = await prisma.negocio.update({
    where: { id: parseInt(id) },
    data: req.body,
    include: {
      categoria: true,
      ciudad: true,
    },
  });

  res.json({
    success: true,
    data: updatedNegocio,
  });
};

export const deleteNegocio = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Not authenticated', 401);
  }

  const { id } = req.params;

  const negocio = await prisma.negocio.findUnique({
    where: { id: parseInt(id) },
  });

  if (!negocio) {
    throw new AppError('Negocio not found', 404);
  }

  if (negocio.propietarioId !== req.user.id && req.user.rol !== 'admin') {
    throw new AppError('Not authorized', 403);
  }

  await prisma.negocio.delete({
    where: { id: parseInt(id) },
  });

  res.json({
    success: true,
    message: 'Negocio deleted successfully',
  });
};







