// src/controllers/CheckInController.ts
    import { Request, Response, NextFunction } from 'express';
    import prisma from '../config/database';
    import { CreateCheckInDTO } from '../types/checkin.types';
    
    interface CheckInStreak {
      currentStreak: number;
      longestStreak: number;
      lastCheckIn: Date | null;
      totalCheckIns: number;
    }
    
    export class CheckInController {
      async create(req: Request, res: Response, next: NextFunction) {
        try {
          const { userId } = req.user;
          const { type, notes } = req.body as CreateCheckInDTO;
    
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
    
          const streak: CheckInStreak = {
            currentStreak,
            longestStreak,
            lastCheckIn,
            totalCheckIns
          };
    
          return res.status(200).json({
            success: true,
            data: streak
          });
        } catch (error) {
          next(error);
        }
      }
    }
