import { Router } from 'express';
import * as chatsController from '../controllers/chats.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, chatsController.getChats);
router.get('/:id', authenticate, chatsController.getChatById);
router.post('/', authenticate, chatsController.createChat);
router.post('/:id/mensajes', authenticate, chatsController.sendMessage);

export default router;







