// src/routes/profile.routes.ts
    import { Router } from 'express';
    import { ProfileController } from '../controllers/ProfileController';
    import { authMiddleware } from '../middleware/auth';
    import { validateProfile } from '../middleware/validation';

    const router = Router();
    const profileController = new ProfileController();

    router.use(authMiddleware); // Protect all profile routes

    router.post('/', validateProfile, profileController.create);
    router.get('/', profileController.getCurrentUserProfile);
    router.get('/:id', profileController.getProfile);
    router.put('/:id', validateProfile, profileController.updateProfile);
    router.delete('/:id', profileController.deleteProfile);

    export default router;
