import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../config/database';

// Nota: El modelo Ciudad no existe en el schema, se usa Municipio en su lugar
// Este endpoint devuelve municipios para mantener compatibilidad con el frontend
export const getAllCiudades = async (req: AuthRequest, res: Response) => {
  const municipios = await prisma.municipio.findMany({
    orderBy: { nombre: 'asc' },
    include: {
      provincia: {
        select: {
          id: true,
          nombre: true,
        },
      },
      _count: {
        select: {
          negocios: {
            where: {
              estado: 'aprobada',
            },
          },
        },
      },
    },
  });

  res.json({
    success: true,
    data: municipios,
  });
};

// Función para crear municipio (usado como "ciudad" en el frontend)
export const createCiudad = async (req: AuthRequest, res: Response) => {
  const { nombre, provinciaId } = req.body;

  if (!nombre || !provinciaId) {
    return res.status(400).json({
      success: false,
      message: 'Nombre y provinciaId son requeridos',
    });
  }

  const municipio = await prisma.municipio.create({
    data: {
      nombre,
      provinciaId: parseInt(provinciaId),
    },
    include: {
      provincia: {
        select: {
          id: true,
          nombre: true,
        },
      },
    },
  });

  res.status(201).json({
    success: true,
    data: municipio,
  });
};

