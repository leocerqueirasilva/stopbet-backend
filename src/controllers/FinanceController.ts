// src/controllers/FinanceController.ts
import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { CreateFinanceDTO } from '../types/finance.types';

interface FinanceSummary {
  totalSaved: number;
  monthlyAverage: number;
  lastMonth: number;
  projection: {
    threeMonths: number;
    sixMonths: number;
    oneYear: number;
  }
}

export class FinanceController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.user;
      const { type, amount, description, date } = req.body as CreateFinanceDTO;

      const newFinance = await prisma.finance.create({
        data: {
          userId,
          type,
          amount,
          description,
          date: date ? new Date(date) : new Date()
        }
      });

      return res.status(201).json({
        success: true,
        data: newFinance
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.user;
      const { page = 1, limit = 10, startDate, endDate, type } = req.query;

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

      if (type) {
        whereClause.type = type as string;
      }

      const finances = await prisma.finance.findMany({
        where: whereClause,
        skip,
        take: limitNumber,
        orderBy: {
          date: 'desc'
        }
      });

      return res.status(200).json({
        success: true,
        data: finances
      });
    } catch (error) {
      next(error);
    }
  }

  async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.user;
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  
      // Buscar todas as transações
      const allTransactions = await prisma.finance.findMany({
        where: {
          userId,
        }
      });
  
      // Calcular savings (apenas SAVING)
      const savings = allTransactions
        .filter(t => t.type === 'SAVING')
        .reduce((sum, finance) => sum + finance.amount.toNumber(), 0);
  
      // Calcular loss record (apenas EXPENSE)
      const lossRecord = allTransactions
        .filter(t => t.type === 'EXPENSE')
        .reduce((sum, finance) => sum + finance.amount.toNumber(), 0);
  
      // Calcular current balance (SAVING - EXPENSE)
      const currentBalance = savings - lossRecord;
  
      // Buscar transações do mês atual
      const currentMonthTransactions = await prisma.finance.findMany({
        where: {
          userId,
          date: {
            gte: firstDayOfMonth,
            lte: currentDate
          }
        }
      });
  
      const currentMonthBalance = currentMonthTransactions.reduce((sum, finance) => {
        const amount = finance.amount.toNumber();
        return sum + (finance.type === 'SAVING' ? amount : -amount);
      }, 0);
  
      const summary = {
        savings,
        lossRecord,
        currentBalance,
        currentMonth: {
          balance: currentMonthBalance,
          savings: currentMonthTransactions
            .filter(t => t.type === 'SAVING')
            .reduce((sum, finance) => sum + finance.amount.toNumber(), 0),
          losses: currentMonthTransactions
            .filter(t => t.type === 'EXPENSE')
            .reduce((sum, finance) => sum + finance.amount.toNumber(), 0)
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

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { type, amount, description, date } = req.body as CreateFinanceDTO;

      const updatedFinance = await prisma.finance.update({
        where: { id },
        data: {
          type,
          amount,
          description,
          date: date ? new Date(date) : new Date()
        }
      });

      return res.status(200).json({
        success: true,
        data: updatedFinance
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await prisma.finance.delete({
        where: { id }
      });

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
