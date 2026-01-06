import { Router } from 'express';
import * as categoriasController from '../controllers/categorias.controller';

const router = Router();

router.get('/', categoriasController.getAllCategorias);
router.get('/:id', categoriasController.getCategoriaById);

export default router;







