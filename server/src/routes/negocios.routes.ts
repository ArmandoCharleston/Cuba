import { Router } from 'express';
import * as negociosController from '../controllers/negocios.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', negociosController.getAllNegocios);
router.get('/:id', negociosController.getNegocioById);
router.post('/', authenticate, authorize('empresa', 'admin'), negociosController.createNegocio);
router.put('/:id', authenticate, negociosController.updateNegocio);
router.delete('/:id', authenticate, negociosController.deleteNegocio);

export default router;


