// src/routes/message.routes.ts
import { Router } from 'express';
import { MessageController } from '../controllers/MessageController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const messageController = new MessageController();

router.get('/', messageController.getMessages);
router.get('/me', authMiddleware, messageController.getMyMessages);
router.post('/', authMiddleware, messageController.createMessage);

export default router;
