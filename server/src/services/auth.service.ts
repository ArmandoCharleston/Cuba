import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/password.util';
import { generateToken } from '../utils/jwt.util';
import { AppError } from '../middleware/errorHandler';

export interface RegisterData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono?: string;
  ciudad?: string;
  rol?: 'cliente' | 'empresa' | 'admin';
}

export interface LoginData {
  email: string;
  password: string;
}

export const register = async (data: RegisterData) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new AppError('El usuario ya existe con este correo electrónico', 400);
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      password: hashedPassword,
      telefono: data.telefono,
      ciudad: data.ciudad,
      rol: data.rol || 'cliente',
    },
    select: {
      id: true,
      nombre: true,
      apellido: true,
      email: true,
      telefono: true,
      ciudad: true,
      rol: true,
      avatar: true,
      createdAt: true,
    },
  });

  const token = generateToken({
    id: user.id,
    email: user.email,
    rol: user.rol,
  });

  return {
    user,
    token,
  };
};

export const login = async (data: LoginData) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new AppError('El usuario no existe', 401);
  }

  const isValidPassword = await comparePassword(data.password, user.password);

  if (!isValidPassword) {
    throw new AppError('La contraseña es incorrecta', 401);
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    rol: user.rol,
  });

  return {
    user: {
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      telefono: user.telefono,
      ciudad: user.ciudad,
      rol: user.rol,
      avatar: user.avatar,
      createdAt: user.createdAt,
    },
    token,
  };
};







