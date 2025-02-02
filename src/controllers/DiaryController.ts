// src/controllers/DiaryController.ts
import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { CreateDiaryDTO } from '../types/diary.types';

export class DiaryController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.user;
      const { content, status } = req.body as CreateDiaryDTO;

      const newEntry = await prisma.diaryEntry.create({
        data: {
          userId,
          content,
          status
        }
      });

      return res.status(201).json({
        success: true,
        data: newEntry
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.user;
      const { page = 1, limit = 10, startDate, endDate, status } = req.query;

      const pageNumber = Number(page);
      const limitNumber = Number(limit);
      const skip = (pageNumber - 1) * limitNumber;

      const whereClause: any = {
        userId
      };

      if (startDate && endDate) {
        whereClause.date = {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string)
        };
      }

      if (status) {
        whereClause.status = status;
      }

      const entries = await prisma.diaryEntry.findMany({
        where: whereClause,
        skip,
        take: limitNumber,
        orderBy: {
          date: 'desc'
        }
      });

      const total = await prisma.diaryEntry.count({
        where: whereClause
      });

      return res.status(200).json({
        success: true,
        data: {
          entries,
          pagination: {
            total,
            page: pageNumber,
            limit: limitNumber,
            pages: Math.ceil(total / limitNumber)
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { userId } = req.user;

      const entry = await prisma.diaryEntry.findFirst({
        where: { 
          id,
          userId // Garante que o usuário só veja suas próprias entradas
        }
      });

      if (!entry) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'DIARY001',
            message: 'Diary entry not found'
          }
        });
      }

      return res.status(200).json({
        success: true,
        data: entry
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { userId } = req.user;
      const { content, status } = req.body as CreateDiaryDTO;

      // Verifica se a entrada pertence ao usuário
      const entry = await prisma.diaryEntry.findFirst({
        where: { id, userId }
      });

      if (!entry) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'DIARY001',
            message: 'Diary entry not found'
          }
        });
      }

      const updatedEntry = await prisma.diaryEntry.update({
        where: { id },
        data: {
          content,
          status
        }
      });

      return res.status(200).json({
        success: true,
        data: updatedEntry
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { userId } = req.user;

      // Verifica se a entrada pertence ao usuário
      const entry = await prisma.diaryEntry.findFirst({
        where: { id, userId }
      });

      if (!entry) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'DIARY001',
            message: 'Diary entry not found'
          }
        });
      }

      await prisma.diaryEntry.delete({
        where: { id }
      });

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}