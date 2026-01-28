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

export const updateNegocioEstado = async (req: AuthRequest, res: Response) => {
  if (!req.user || req.user.rol !== 'admin') {
    throw new AppError('Admin access required', 403);
  }

  const { id } = req.params;
  const { estado } = req.body;

  if (!estado || !['pendiente', 'aprobada', 'rechazada'].includes(estado)) {
    throw new AppError('Estado inválido. Debe ser: pendiente, aprobada o rechazada', 400);
  }

  const negocio = await prisma.negocio.findUnique({
    where: { id: parseInt(id) },
  });

  if (!negocio) {
    throw new AppError('Negocio no encontrado', 404);
  }

  const updatedNegocio = await prisma.negocio.update({
    where: { id: parseInt(id) },
    data: { estado: estado as 'pendiente' | 'aprobada' | 'rechazada' },
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
    },
  });

  res.json({
    success: true,
    data: updatedNegocio,
    message: `Negocio ${estado === 'aprobada' ? 'aprobado' : estado === 'rechazada' ? 'rechazado' : 'marcado como pendiente'} exitosamente`,
  });
};

export const removeDuplicateAdmins = async (req: AuthRequest, res: Response) => {
  if (!req.user || req.user.rol !== 'admin') {
    throw new AppError('Admin access required', 403);
  }

  const adminEmail = 'admin@reservatecuba.com';
  
  // Obtener todos los administradores
  const admins = await prisma.user.findMany({
    where: { rol: 'admin' },
    orderBy: { createdAt: 'asc' },
  });

  if (admins.length <= 1) {
    return res.json({
      success: true,
      message: 'No hay administradores duplicados',
      data: { totalAdmins: admins.length },
    });
  }

  // Mantener solo el primer admin (el más antiguo) o el que tiene el email admin@reservatecuba.com
  const mainAdmin = admins.find((a) => a.email === adminEmail) || admins[0];
  const duplicateAdmins = admins.filter((a) => a.id !== mainAdmin.id);

  // Eliminar administradores duplicados
  const deletedCount = await prisma.user.deleteMany({
    where: {
      id: {
        in: duplicateAdmins.map((a) => a.id),
      },
    },
  });

  res.json({
    success: true,
    message: `Se eliminaron ${deletedCount.count} administrador(es) duplicado(s)`,
    data: {
      mainAdmin: {
        id: mainAdmin.id,
        email: mainAdmin.email,
        nombre: mainAdmin.nombre,
      },
      deletedCount: deletedCount.count,
      totalAdmins: admins.length - deletedCount.count,
    },
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

  // Eliminar todos los negocios y sus relaciones
  // Primero eliminar fotos de negocios
  await prisma.negocioFoto.deleteMany({});
  // Luego eliminar negocios (esto eliminará automáticamente servicios, reservas, chats, etc. por cascada)
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

export const deleteUsuario = async (req: AuthRequest, res: Response) => {
  if (!req.user || req.user.rol !== 'admin') {
    throw new AppError('Admin access required', 403);
  }

  const { id } = req.params;
  const userId = parseInt(id);

  // No permitir eliminar al propio admin
  if (userId === req.user.id) {
    throw new AppError('No puedes eliminar tu propia cuenta', 400);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError('Usuario no encontrado', 404);
  }

  // Si es admin, verificar que no sea el único admin
  if (user.rol === 'admin') {
    const adminCount = await prisma.user.count({
      where: { rol: 'admin' },
    });
    if (adminCount <= 1) {
      throw new AppError('No se puede eliminar el último administrador', 400);
    }
  }

  // Eliminar el usuario (esto eliminará automáticamente sus negocios, reservas, etc. por cascada)
  await prisma.user.delete({
    where: { id: userId },
  });

  res.json({
    success: true,
    message: 'Usuario eliminado exitosamente',
  });
};

export const deleteEmpresa = async (req: AuthRequest, res: Response) => {
  if (!req.user || req.user.rol !== 'admin') {
    throw new AppError('Admin access required', 403);
  }

  const { id } = req.params;
  const empresaId = parseInt(id);

  // No permitir eliminar al propio admin
  if (empresaId === req.user.id) {
    throw new AppError('No puedes eliminar tu propia cuenta', 400);
  }

  const empresa = await prisma.user.findUnique({
    where: { id: empresaId },
    include: {
      negocios: true,
    },
  });

  if (!empresa) {
    throw new AppError('Empresa no encontrada', 404);
  }

  if (empresa.rol !== 'empresa') {
    throw new AppError('El usuario no es una empresa', 400);
  }

  // Eliminar la empresa (esto eliminará automáticamente sus negocios, reservas, etc. por cascada)
  await prisma.user.delete({
    where: { id: empresaId },
  });

  res.json({
    success: true,
    message: 'Empresa eliminada exitosamente',
  });
};

