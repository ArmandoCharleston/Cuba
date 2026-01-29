import { Router } from 'express';
import * as provinciasController from '../controllers/provincias.controller';

const router = Router();

router.get('/', provinciasController.getAllProvincias);
router.get('/:id', provinciasController.getProvinciaById);

export default router;



