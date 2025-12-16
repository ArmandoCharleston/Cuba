import { Router } from 'express';
import * as reservasController from '../controllers/reservas.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, reservasController.getReservas);
router.get('/:id', authenticate, reservasController.getReservaById);
router.post('/', authenticate, reservasController.createReserva);
router.patch('/:id/estado', authenticate, reservasController.updateReservaEstado);

export default router;


