import { Router } from 'express';
import * as municipiosController from '../controllers/municipios.controller';

const router = Router();

router.get('/', municipiosController.getAllMunicipios);
router.get('/:id', municipiosController.getMunicipioById);

export default router;



