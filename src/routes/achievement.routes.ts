// src/routes/achievement.routes.ts
    import { Router } from 'express';
    import { AchievementController } from '../controllers/AchievementController';
    import { authMiddleware } from '../middleware/auth';
    
    const router = Router();
    const achievementController = new AchievementController();
    
    router.use(authMiddleware);
    
    router.get('/', achievementController.getAll);
    
    export default router;
