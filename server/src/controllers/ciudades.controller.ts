import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

// Mantener este controller para compatibilidad con el frontend
// pero retornar un array vacío ya que ahora usamos provincias/municipios
export const getAllCiudades = async (req: AuthRequest, res: Response) => {
  // Retornar array vacío ya que ahora usamos provincias/municipios
  // Esto mantiene la compatibilidad con el frontend que aún puede tener referencias
  res.json({
    success: true,
    data: [],
  });
};

export const createCiudad = async (req: AuthRequest, res: Response) => {
  // Endpoint deprecated - usar provincias/municipios en su lugar
  throw new AppError('Este endpoint está deprecated. Use provincias/municipios en su lugar.', 400);
};

