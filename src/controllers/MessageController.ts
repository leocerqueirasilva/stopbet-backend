// src/controllers/MessageController.ts
import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { authMiddleware } from '../middleware/auth';
import { Server } from 'socket.io';

let io: Server;

export const setIoInstance = (ioInstance: Server) => {
  io = ioInstance;
};

export class MessageController {
  async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const page = parseInt(req.query.page as string) || 1;
      const skip = (page - 1) * limit;

      const messages = await prisma.message.findMany({
        orderBy: {
          createdAt: 'asc',
        },
        skip,
        take: limit,
        select: {
          id: true,
          userName: true,
          createdAt: true,
          content: true,
        },
      });

      res.status(200).json({
        success: true,
        data: messages,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.user; // Obtido do token JWT via authMiddleware
      const limit = parseInt(req.query.limit as string) || 20;
      const page = parseInt(req.query.page as string) || 1;
      const skip = (page - 1) * limit;

      const messages = await prisma.message.findMany({
        where: {
          userId: userId // Filtra mensagens pelo ID do usuário autenticado
        },
        orderBy: {
          createdAt: 'asc',
        },
        skip,
        take: limit,
        select: {
          id: true,
          userName: true,
          createdAt: true,
          content: true,
        },
      });

      res.status(200).json({
        success: true,
        data: messages,
      });
    } catch (error) {
      next(error);
    }
  }

  async createMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.user;
      const { content } = req.body;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { fullName: true }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'USER001',
            message: 'User not found',
          },
        });
      }

      const newMessage = await prisma.message.create({
        data: {
          userId,
          userName: user.fullName, // Use email as userName
          content,
        },
        select: {
          id: true,
          userName: true,
          createdAt: true,
          content: true,
        },
      });

      // MessageController.ts (no método createMessage)
      io.emit('newMessage', newMessage);
      console.log('Event "newMessage" emitted:', newMessage); // Adicione esta linha

      res.status(201).json({
        success: true,
        data: newMessage,
      });
    } catch (error) {
      next(error);
    }
  }
}
