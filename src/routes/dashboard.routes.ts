// src/routes/dashboard.routes.ts
    import { Router } from 'express';
    import { DashboardController } from '../controllers/DashboardController';
    import { authMiddleware } from '../middleware/auth';
    
    const router = Router();
    const dashboardController = new DashboardController();
    
    router.use(authMiddleware);
    
    router.get('/summary', dashboardController.getSummary);
    
    export default router;
