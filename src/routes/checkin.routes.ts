// src/routes/checkin.routes.ts
    import { Router } from 'express';
    import { CheckInController } from '../controllers/CheckInController';
    import { authMiddleware } from '../middleware/auth';
    import { validateCheckIn } from '../middleware/validation';
    
    const router = Router();
    const checkInController = new CheckInController();
    
    router.use(authMiddleware);
    
    router.post('/', validateCheckIn, checkInController.create);
    router.get('/streak', checkInController.getStreak);
    
    export default router;
