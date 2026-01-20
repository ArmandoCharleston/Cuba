import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

export const getDashboard = async (req: AuthRequest, res: Response) => {
  if (!req.user || req.user.rol !== 'admin') {
    throw new AppError('Admin access required', 403);
  }

  const [
    totalUsuarios,
    totalNegocios,
    totalReservas,
    totalResenas,
    usuariosPorRol,
    reservasPorEstado,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.negocio.count(),
    prisma.reserva.count(),
    prisma.resena.count(),
    prisma.user.groupBy({
      by: ['rol'],
      _count: true,
    }),
    prisma.reserva.groupBy({
      by: ['estado'],
      _count: true,
    }),
  ]);

  res.json({
    success: true,
    data: {
      totalUsuarios,
      totalNegocios,
      totalReservas,
      totalResenas,
      usuariosPorRol,
      reservasPorEstado,
    },
  });
};

export const getAllUsuarios = async (req: AuthRequest, res: Response) => {
  if (!req.user || req.user.rol !== 'admin') {
    throw new AppError('Admin access required', 403);
  }

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const [usuarios, total] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        telefono: true,
        ciudad: true,
        rol: true,
        createdAt: true,
        _count: {
          select: {
            negocios: true,
            reservas: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count(),
  ]);

  res.json({
    success: true,
    data: usuarios,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
};

export const getAllEmpresas = async (req: AuthRequest, res: Response) => {
  if (!req.user || req.user.rol !== 'admin') {
    throw new AppError('Admin access required', 403);
  }

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const [empresas, total] = await Promise.all([
    prisma.user.findMany({
      where: { rol: 'empresa' },
      include: {
        negocios: {
          include: {
            categoria: true,
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
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where: { rol: 'empresa' } }),
  ]);

  res.json({
    success: true,
    data: empresas,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
};

export const updateUserRole = async (req: AuthRequest, res: Response) => {
  if (!req.user || req.user.rol !== 'admin') {
    throw new AppError('Admin access required', 403);
  }

  const { id } = req.params;
  const { rol } = req.body;

  const user = await prisma.user.update({
    where: { id: parseInt(id) },
    data: { rol },
    select: {
      id: true,
      nombre: true,
      apellido: true,
      email: true,
      rol: true,
    },
  });

  res.json({
    success: true,
    data: user,
  });
};

export const cleanMockData = async (req: AuthRequest, res: Response) => {
  if (!req.user || req.user.rol !== 'admin') {
    throw new AppError('Admin access required', 403);
  }

  const adminEmail = 'admin@reservatecuba.com';
  
  // Eliminar todos los usuarios excepto el admin
  const deletedUsers = await prisma.user.deleteMany({
    where: {
      email: {
        not: adminEmail,
      },
    },
  });

  // Eliminar todos los negocios
  const deletedNegocios = await prisma.negocio.deleteMany({});

  // Eliminar todas las reservas
  const deletedReservas = await prisma.reserva.deleteMany({});

  // Eliminar todos los chats
  const deletedChats = await prisma.chat.deleteMany({});

  // Eliminar todas las reseñas
  const deletedResenas = await prisma.resena.deleteMany({});

  // Eliminar todos los favoritos
  const deletedFavoritos = await prisma.favorito.deleteMany({});

  res.json({
    success: true,
    message: 'Datos mock eliminados correctamente',
    data: {
      usuariosEliminados: deletedUsers.count,
      negociosEliminados: deletedNegocios.count,
      reservasEliminadas: deletedReservas.count,
      chatsEliminados: deletedChats.count,
      resenasEliminadas: deletedResenas.count,
      favoritosEliminados: deletedFavoritos.count,
    },
  });
};

