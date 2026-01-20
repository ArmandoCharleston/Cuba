import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);
router.use(authorize('admin'));

router.get('/dashboard', adminController.getDashboard);
router.get('/usuarios', adminController.getAllUsuarios);
router.get('/empresas', adminController.getAllEmpresas);
router.patch('/usuarios/:id/rol', adminController.updateUserRole);
router.post('/clean-mock-data', adminController.cleanMockData);

export default router;

