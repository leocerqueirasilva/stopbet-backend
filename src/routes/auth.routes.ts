// src/routes/auth.routes.ts
import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validateRegistration, validateLogin } from '../middleware/validation';

const router = Router();
const authController = new AuthController();

router.post('/register', validateRegistration, authController.register);
router.post('/login', validateLogin, authController.login);

// Rotas para exclusão de conta
router.post('/request-deletion', authController.requestAccountDeletion);
router.get('/confirm-deletion/:token', authController.confirmAccountDeletion);

export default router;
