import { Router } from 'express';
import * as resenasController from '../controllers/resenas.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/negocio/:negocioId', resenasController.getResenasByNegocio);
router.post('/', authenticate, resenasController.createResena);

export default router;

