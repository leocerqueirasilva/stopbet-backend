// src/routes/diary.routes.ts
    import { Router } from 'express';
    import { DiaryController } from '../controllers/DiaryController';
    import { authMiddleware } from '../middleware/auth';
    import { validateDiaryEntry } from '../middleware/validation';
    
    const router = Router();
    const diaryController = new DiaryController();
    
    router.use(authMiddleware);
    
    router.post('/', validateDiaryEntry, diaryController.create);
    router.get('/', diaryController.getAll);
    router.get('/:id', diaryController.getById);
    router.put('/:id', validateDiaryEntry, diaryController.update);
    router.delete('/:id', diaryController.delete);
    
    export default router;
