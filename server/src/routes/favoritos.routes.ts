import { Router } from 'express';
import * as favoritosController from '../controllers/favoritos.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, favoritosController.getFavoritos);
router.post('/toggle', authenticate, favoritosController.toggleFavorito);

export default router;

