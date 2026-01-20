import { Router } from 'express';
import * as categoriasController from '../controllers/categorias.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', categoriasController.getAllCategorias);
router.get('/:id', categoriasController.getCategoriaById);
// Solo admin puede crear categorías
router.post('/', authenticate, authorize('admin'), categoriasController.createCategoria);

export default router;







