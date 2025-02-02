// src/controllers/DashboardController.ts
    import { Request, Response, NextFunction } from 'express';
    import prisma from '../config/database';
    
    interface DashboardSummary {
      daysRegistered: number;
      sobrietyDays: number;
      lastCheckIn: Date | null;
      totalSaved: number;
      hoursSaved: number;
      achievements: {
        total: number;
        completed: number;
      }
    }
    
    export class DashboardController {
      async getSummary(req: Request, res: Response, next: NextFunction) {
        try {
          const { userId } = req.user;
    
          const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
              checkIns: true,
              finances: true,
              achievements: true
            }
          });
    
          if (!user) {
            return res.status(404).json({
              success: false,
              error: {
                code: 'USER001',
                message: 'User not found'
              }
            });
          }
    
          const daysRegistered = Math.floor((Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24));
          const sobrietyDays = 0; // TODO: Implement sobriety days calculation
          const lastCheckIn = user.checkIns.length > 0 ? user.checkIns[user.checkIns.length - 1].createdAt : null;
          const totalSaved = user.finances.filter(finance => finance.type === 'SAVING').reduce((sum, finance) => sum + finance.amount.toNumber(), 0);
          const hoursSaved = 0; // TODO: Implement hours saved calculation
          const totalAchievements = user.achievements.length;
          const completedAchievements = user.achievements.filter(achievement => achievement.status === 'COMPLETED').length;
    
          const summary: DashboardSummary = {
            daysRegistered,
            sobrietyDays,
            lastCheckIn,
            totalSaved,
            hoursSaved,
            achievements: {
              total: totalAchievements,
              completed: completedAchievements
            }
          };
    
          return res.status(200).json({
            success: true,
            data: summary
          });
        } catch (error) {
          next(error);
        }
      }
    }
