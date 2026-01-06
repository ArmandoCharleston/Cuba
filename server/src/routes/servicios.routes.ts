import { Router } from 'express';
import * as serviciosController from '../controllers/servicios.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/negocio/:negocioId', serviciosController.getServiciosByNegocio);
router.post('/negocio/:negocioId', authenticate, serviciosController.createServicio);
router.put('/:id', authenticate, serviciosController.updateServicio);
router.delete('/:id', authenticate, serviciosController.deleteServicio);

export default router;







