import { Router } from 'express';
import * as ciudadesController from '../controllers/ciudades.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', ciudadesController.getAllCiudades);
// Solo admin puede crear ciudades
router.post('/', authenticate, authorize('admin'), ciudadesController.createCiudad);

export default router;

