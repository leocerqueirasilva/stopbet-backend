// src/controllers/AchievementController.ts
import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { DEFAULT_ACHIEVEMENTS } from '../types/achievement.types';

export class AchievementController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.user;

      // Buscar achievements do usuário
      const userAchievements = await prisma.achievement.findMany({
        where: { userId }
      });

      // Se o usuário não tem achievements, criar os padrões
      if (userAchievements.length === 0) {
        const defaultAchievements = await Promise.all(
          DEFAULT_ACHIEVEMENTS.map(achievement =>
            prisma.achievement.create({
              data: {
                ...achievement,
                userId,
                status: 'LOCKED'
              }
            })
          )
        );

        return res.status(200).json({
          success: true,
          data: defaultAchievements
        });
      }

      return res.status(200).json({
        success: true,
        data: userAchievements
      });
    } catch (error) {
      next(error);
    }
  }

  // Método para verificar e atualizar achievements baseado no streak
  async checkAndUpdateAchievements(userId: string, currentStreak: number) {
    try {
      const achievements = await prisma.achievement.findMany({
        where: { userId }
      });

      for (const achievement of achievements) {
        console.log('\nChecking achievement:', {
          id: achievement.id,
          type: achievement.type,
          days: achievement.days,
          status: achievement.status
        });
  
        if (currentStreak >= achievement.days && achievement.status === 'LOCKED') {
          
          const updated = await prisma.achievement.update({
            where: { id: achievement.id },
            data: {
              status: 'COMPLETED',
              earnedAt: new Date()
            }
          });
        }
      }
  
    } catch (error) {
      console.error('Error in checkAndUpdateAchievements:', error);
    }
  }
}