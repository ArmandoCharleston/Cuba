import { Router } from 'express';
import * as usuariosController from '../controllers/usuarios.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/profile', authenticate, usuariosController.getProfile);
router.put('/profile', authenticate, usuariosController.updateProfile);

export default router;







