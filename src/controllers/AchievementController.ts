// src/controllers/AchievementController.ts
    import { Request, Response, NextFunction } from 'express';
    import prisma from '../config/database';
    
    export class AchievementController {
      async getAll(req: Request, res: Response, next: NextFunction) {
        try {
          const { userId } = req.user;
    
          const achievements = await prisma.achievement.findMany({
            where: { userId }
          });
    
          return res.status(200).json({
            success: true,
            data: achievements
          });
        } catch (error) {
          next(error);
        }
      }
    }
