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
    where.clienteId = req.user.id;
  } else if (req.user.rol === 'empresa') {
    where.empresaId = req.user.id;
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

  if (
    chat.clienteId !== req.user.id &&
    chat.empresaId !== req.user.id &&
    req.user.rol !== 'admin'
  ) {
    throw new AppError('Not authorized', 403);
  }

  // Mark messages as read
  if (req.user.rol === 'cliente') {
    await prisma.mensaje.updateMany({
      where: {
        chatId: chat.id,
        remitente: 'empresa',
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
        remitente: 'cliente',
        leido: false,
      },
      data: { leido: true },
    });
    await prisma.chat.update({
      where: { id: chat.id },
      data: { noLeidosEmpresa: 0 },
    });
  }

  res.json({
    success: true,
    data: chat,
  });
};

export const createChat = async (req: AuthRequest, res: Response) => {
  if (!req.user || req.user.rol !== 'cliente') {
    throw new AppError('Only clientes can create chats', 403);
  }

  const { empresaId, negocioId } = req.body;

  const existingChat = await prisma.chat.findFirst({
    where: {
      clienteId: req.user.id,
      empresaId: parseInt(empresaId),
      negocioId: parseInt(negocioId),
    },
  });

  if (existingChat) {
    return res.json({
      success: true,
      data: existingChat,
    });
  }

  const chat = await prisma.chat.create({
    data: {
      clienteId: req.user.id,
      empresaId: parseInt(empresaId),
      negocioId: parseInt(negocioId),
    },
    include: {
      cliente: true,
      empresa: true,
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

  if (
    chat.clienteId !== req.user.id &&
    chat.empresaId !== req.user.id &&
    req.user.rol !== 'admin'
  ) {
    throw new AppError('Not authorized', 403);
  }

  const remitente = req.user.rol === 'cliente' ? 'cliente' : 'empresa';

  const mensaje = await prisma.mensaje.create({
    data: {
      chatId: parseInt(id),
      remitente,
      texto,
      usuarioId: req.user.id,
    },
  });

  if (remitente === 'cliente') {
    await prisma.chat.update({
      where: { id: chat.id },
      data: {
        noLeidosEmpresa: { increment: 1 },
        updatedAt: new Date(),
      },
    });
  } else {
    await prisma.chat.update({
      where: { id: chat.id },
      data: {
        noLeidosCliente: { increment: 1 },
        updatedAt: new Date(),
      },
    });
  }

  res.status(201).json({
    success: true,
    data: mensaje,
  });
};


