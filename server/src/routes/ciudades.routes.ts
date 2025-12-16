import { Router } from 'express';
import * as ciudadesController from '../controllers/ciudades.controller';

const router = Router();

router.get('/', ciudadesController.getAllCiudades);

export default router;

