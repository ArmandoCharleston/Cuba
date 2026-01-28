import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

export const getChats = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Not authenticated', 401);
  }

  const where: any = {};

  if (req.user.rol === 'cliente') {
    where.OR = [
      { clienteId: req.user.id },
      { tipo: 'cliente-admin', clienteId: req.user.id },
    ];
  } else if (req.user.rol === 'empresa') {
    where.OR = [
      { empresaId: req.user.id },
      { tipo: 'empresa-admin', empresaId: req.user.id },
    ];
  } else if (req.user.rol === 'admin') {
    where.OR = [
      { adminId: req.user.id },
      { tipo: 'cliente-admin' },
      { tipo: 'empresa-admin' },
    ];
  }

  const chats = await prisma.chat.findMany({
    where,
    include: {
      cliente: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
          avatar: true,
        },
      },
      empresa: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
          avatar: true,
        },
      },
      admin: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
          avatar: true,
        },
      },
      negocio: {
        select: {
          id: true,
          nombre: true,
          foto: true,
        },
      },
      mensajes: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { updatedAt: 'desc' },
  });

  res.json({
    success: true,
    data: chats,
  });
};

export const getChatById = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Not authenticated', 401);
  }

  const { id } = req.params;

  const chat = await prisma.chat.findUnique({
    where: { id: parseInt(id) },
    include: {
      cliente: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
          avatar: true,
        },
      },
      empresa: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
          avatar: true,
        },
      },
      admin: {
        select: {
          id: true,
          nombre: true,
          apellido: true,
          avatar: true,
        },
      },
      negocio: {
        select: {
          id: true,
          nombre: true,
          foto: true,
        },
      },
      mensajes: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!chat) {
    throw new AppError('Chat not found', 404);
  }

  // Verificar autorización según el tipo de chat
  const isAuthorized =
    (chat.clienteId === req.user.id) ||
    (chat.empresaId === req.user.id) ||
    (chat.adminId === req.user.id) ||
    (req.user.rol === 'admin');

  if (!isAuthorized) {
    throw new AppError('Not authorized', 403);
  }

  // Mark messages as read
  if (req.user.rol === 'cliente') {
    await prisma.mensaje.updateMany({
      where: {
        chatId: chat.id,
        remitente: { in: ['empresa', 'admin'] },
        leido: false,
      },
      data: { leido: true },
    });
    await prisma.chat.update({
      where: { id: chat.id },
      data: { noLeidosCliente: 0 },
    });
  } else if (req.user.rol === 'empresa') {
    await prisma.mensaje.updateMany({
      where: {
        chatId: chat.id,
        remitente: { in: ['cliente', 'admin'] },
        leido: false,
      },
      data: { leido: true },
    });
    await prisma.chat.update({
      where: { id: chat.id },
      data: { noLeidosEmpresa: 0 },
    });
  } else if (req.user.rol === 'admin') {
    await prisma.mensaje.updateMany({
      where: {
        chatId: chat.id,
        remitente: { in: ['cliente', 'empresa'] },
        leido: false,
      },
      data: { leido: true },
    });
    await prisma.chat.update({
      where: { id: chat.id },
      data: { noLeidosAdmin: 0 },
    });
  }

  res.json({
    success: true,
    data: chat,
  });
};

export const createChat = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Not authenticated', 401);
  }

  const { empresaId, negocioId, adminId, tipo } = req.body;

  // Determinar tipo de chat si no se especifica
  let chatType = tipo;
  if (!chatType) {
    if (req.user.rol === 'cliente' && empresaId) {
      chatType = 'cliente-empresa';
    } else if (req.user.rol === 'empresa') {
      chatType = 'empresa-admin'; // Para empresas, siempre es con admin
    } else if (req.user.rol === 'cliente' && adminId) {
      chatType = 'cliente-admin';
    } else {
      throw new AppError('Tipo de chat no válido', 400);
    }
  }
  
  // Validar que los campos requeridos estén presentes
  if (chatType === 'cliente-empresa' && !empresaId) {
    throw new AppError('empresaId es requerido para chats cliente-empresa', 400);
  }

  // Buscar chat existente y obtener adminId si es necesario
  let existingChat;
  let finalAdminId: number | null = null;
  
  if (chatType === 'cliente-empresa') {
    existingChat = await prisma.chat.findFirst({
      where: {
        clienteId: req.user.id,
        empresaId: parseInt(empresaId),
        negocioId: negocioId ? parseInt(negocioId) : undefined,
        tipo: 'cliente-empresa',
      },
    });
  } else if (chatType === 'empresa-admin' || chatType === 'cliente-admin') {
    // Si no se proporciona adminId, buscar el primer admin disponible
    finalAdminId = adminId ? parseInt(adminId) : null;
    if (!finalAdminId) {
      const firstAdmin = await prisma.user.findFirst({
        where: { rol: 'admin' },
        select: { id: true },
      });
      if (firstAdmin) {
        finalAdminId = firstAdmin.id;
      } else {
        throw new AppError('No hay administradores disponibles', 404);
      }
    }
    
    if (chatType === 'empresa-admin') {
      existingChat = await prisma.chat.findFirst({
        where: {
          empresaId: req.user.id,
          adminId: finalAdminId,
          tipo: 'empresa-admin',
        },
      });
    } else {
      existingChat = await prisma.chat.findFirst({
        where: {
          clienteId: req.user.id,
          adminId: finalAdminId,
          tipo: 'cliente-admin',
        },
      });
    }
  }

  if (existingChat) {
    return res.json({
      success: true,
      data: existingChat,
    });
  }

  // Crear nuevo chat
  const chatData: any = {
    tipo: chatType,
  };

  if (chatType === 'cliente-empresa') {
    if (!empresaId) {
      throw new AppError('empresaId es requerido para chats cliente-empresa', 400);
    }
    chatData.clienteId = req.user.id;
    chatData.empresaId = parseInt(empresaId);
    if (negocioId) chatData.negocioId = parseInt(negocioId);
  } else if (chatType === 'empresa-admin') {
    chatData.empresaId = req.user.id;
    chatData.adminId = finalAdminId!; // Ya calculado arriba
  } else if (chatType === 'cliente-admin') {
    chatData.clienteId = req.user.id;
    chatData.adminId = finalAdminId!; // Ya calculado arriba
  }

  const chat = await prisma.chat.create({
    data: chatData,
    include: {
      cliente: true,
      empresa: true,
      admin: true,
      negocio: true,
    },
  });

  res.status(201).json({
    success: true,
    data: chat,
  });
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    throw new AppError('Not authenticated', 401);
  }

  const { id } = req.params;
  const { texto } = req.body;

  const chat = await prisma.chat.findUnique({
    where: { id: parseInt(id) },
  });

  if (!chat) {
    throw new AppError('Chat not found', 404);
  }

  // Verificar autorización
  const isAuthorized =
    (chat.clienteId === req.user.id) ||
    (chat.empresaId === req.user.id) ||
    (chat.adminId === req.user.id) ||
    (req.user.rol === 'admin');

  if (!isAuthorized) {
    throw new AppError('Not authorized', 403);
  }

  // Determinar remitente
  let remitente = 'cliente';
  if (req.user.rol === 'empresa') {
    remitente = 'empresa';
  } else if (req.user.rol === 'admin') {
    remitente = 'admin';
  }

  const mensaje = await prisma.mensaje.create({
    data: {
      chatId: parseInt(id),
      remitente,
      texto,
      usuarioId: req.user.id,
    },
  });

  // Actualizar contadores de no leídos según el tipo de chat
  if (chat.tipo === 'cliente-empresa') {
    if (remitente === 'cliente') {
      await prisma.chat.update({
        where: { id: chat.id },
        data: {
          noLeidosEmpresa: { increment: 1 },
          updatedAt: new Date(),
        },
      });
    } else if (remitente === 'empresa') {
      await prisma.chat.update({
        where: { id: chat.id },
        data: {
          noLeidosCliente: { increment: 1 },
          updatedAt: new Date(),
        },
      });
    }
  } else if (chat.tipo === 'empresa-admin') {
    if (remitente === 'empresa') {
      await prisma.chat.update({
        where: { id: chat.id },
        data: {
          noLeidosAdmin: { increment: 1 },
          updatedAt: new Date(),
        },
      });
    } else if (remitente === 'admin') {
      await prisma.chat.update({
        where: { id: chat.id },
        data: {
          noLeidosEmpresa: { increment: 1 },
          updatedAt: new Date(),
        },
      });
    }
  } else if (chat.tipo === 'cliente-admin') {
    if (remitente === 'cliente') {
      await prisma.chat.update({
        where: { id: chat.id },
        data: {
          noLeidosAdmin: { increment: 1 },
          updatedAt: new Date(),
        },
      });
    } else if (remitente === 'admin') {
      await prisma.chat.update({
        where: { id: chat.id },
        data: {
          noLeidosCliente: { increment: 1 },
          updatedAt: new Date(),
        },
      });
    }
  }

  res.status(201).json({
    success: true,
    data: mensaje,
  });
};







