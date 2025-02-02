// src/routes/finance.routes.ts
import { Router } from 'express';
import { FinanceController } from '../controllers/FinanceController';
import { authMiddleware } from '../middleware/auth';
import { validateFinance } from '../middleware/validation';

const router = Router();
const financeController = new FinanceController();

router.use(authMiddleware);

router.post('/', validateFinance, financeController.create);
router.get('/', financeController.getAll);
router.get('/summary', financeController.getSummary);
router.put('/:id', validateFinance, financeController.update);
router.delete('/:id', financeController.delete);

export default router;
