import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

// Retornar todos los municipios como "ciudades" para compatibilidad con el frontend
// Los municipios son las ciudades reales del sistema
export const getAllCiudades = async (req: AuthRequest, res: Response) => {
  try {
    const municipios = await prisma.municipio.findMany({
      include: {
        provincia: {
          select: {
            nombre: true,
          },
        },
      },
      orderBy: {
        nombre: 'asc',
      },
    });

    // Formatear como ciudades para compatibilidad con el frontend
    const ciudades = municipios.map((municipio) => ({
      id: municipio.id,
      nombre: `${municipio.nombre}, ${municipio.provincia.nombre}`,
      municipioId: municipio.id,
      provinciaId: municipio.provinciaId,
    }));

    res.json({
      success: true,
      data: ciudades,
    });
  } catch (error: any) {
    throw new AppError('Error al obtener las ciudades', 500);
  }
};

export const createCiudad = async (req: AuthRequest, res: Response) => {
  // Endpoint deprecated - usar provincias/municipios en su lugar
  throw new AppError('Este endpoint está deprecated. Use provincias/municipios en su lugar.', 400);
};

