// src/controllers/CheckInController.ts
import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { CreateCheckInDTO } from '../types/checkin.types';
import { AchievementController } from './AchievementController';

interface CheckInStreak {
  currentStreak: number;
  longestStreak: number;
  lastCheckIn: Date | null;
  totalCheckIns: number;
}

export class CheckInController {
  constructor(private achievementController = new AchievementController()) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.user;
      const { type, notes } = req.body as CreateCheckInDTO;
  
      // Verificar se já existe check-in hoje
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      const existingCheckIn = await prisma.checkIn.findFirst({
        where: {
          userId,
          type: 'DAILY',
          createdAt: {
            gte: today
          }
        }
      });
  
      if (existingCheckIn) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'CHECKIN001',
            message: 'You already did your check-in today'
          }
        });
      }
  
      const newCheckIn = await prisma.checkIn.create({
        data: {
          userId,
          type,
          notes
        }
      });

  
      return res.status(201).json({
        success: true,
        data: newCheckIn
      });
    } catch (error) {
      next(error);
    }
  }

  async getStreak(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.user;

      const checkIns = await prisma.checkIn.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });

      const totalCheckIns = checkIns.length;
      const lastCheckIn = checkIns.length > 0 ? checkIns[0].createdAt : null;

      let sobrietyTime = {
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalHours: 0
      };

      if (lastCheckIn) {
        const now = new Date();
        
        // Pegar o check-in mais antigo da sequência atual
        let firstCheckInOfStreak = checkIns[checkIns.length - 1]; // Começa com o mais antigo
        let consecutiveCheckIns = 1;
        let accumulatedHours = 0;
      
        // Verificar check-ins consecutivos
        for (let i = checkIns.length - 1; i > 0; i--) {
          const currentCheckIn = new Date(checkIns[i].createdAt);
          const previousCheckIn = new Date(checkIns[i - 1].createdAt);
          const diffTime = Math.abs(previousCheckIn.getTime() - currentCheckIn.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
          if (diffDays <= 1) {
            consecutiveCheckIns++;
            accumulatedHours += 24; // Adiciona 24 horas para cada dia consecutivo
          } else {
            break;
          }
        }
      
        // Se tiver mais de um check-in consecutivo, usa o primeiro da sequência
        if (consecutiveCheckIns > 1) {
          const timeDiff = now.getTime() - firstCheckInOfStreak.createdAt.getTime();
          const totalHours = Math.floor(timeDiff / (1000 * 60 * 60)) + accumulatedHours;
          const remainingTime = timeDiff % (1000 * 60 * 60);
          const minutes = Math.floor(remainingTime / (1000 * 60));
          const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
      
          sobrietyTime = {
            hours: totalHours % 24,
            minutes,
            seconds,
            totalHours
          };
        } else {
          // Se tiver apenas um check-in, calcula normalmente
          const timeDiff = now.getTime() - lastCheckIn.getTime();
          const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
          const minutesDiff = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
          const secondsDiff = Math.floor((timeDiff % (1000 * 60)) / 1000);
      
          sobrietyTime = {
            hours: hoursDiff % 24,
            minutes: minutesDiff,
            seconds: secondsDiff,
            totalHours: hoursDiff
          };
        }
      }

      let currentStreak = 0;
      let longestStreak = 0;
      let currentDate = new Date();

      for (const checkIn of checkIns) {
        const checkInDate = new Date(checkIn.createdAt);
        const diffTime = Math.abs(currentDate.getTime() - checkInDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 1) {
          currentStreak++;
          currentDate = checkInDate;
        } else {
          break;
        }
      }

      longestStreak = checkIns.reduce((maxStreak, checkIn, index, arr) => {
        let streak = 0;
        let tempDate = new Date();

        for (let i = index; i < arr.length; i++) {
          const checkInDate = new Date(arr[i].createdAt);
          const diffTime = Math.abs(tempDate.getTime() - checkInDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays <= 1) {
            streak++;
            tempDate = checkInDate;
          } else {
            break;
          }
        }
        return Math.max(maxStreak, streak);
      }, 0);

      const achievementController = new AchievementController();
      await achievementController.checkAndUpdateAchievements(userId, currentStreak);

      return res.status(200).json({
        success: true,
        data: {
          currentStreak,
          longestStreak,
          lastCheckIn,
          totalCheckIns,
          sobrietyTime
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
