// src/controllers/AuthController.ts
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { jwtSecret, jwtExpiresIn } from '../config/jwt';
import { RegistrationDTO, LoginDTO } from '../types/auth.types';
import { config } from '../config/config';
import { EmailService } from '../services/EmailService';

const emailService = new EmailService();

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      // Adicione "fullName" no DTO
      const { email, password, fullName } = req.body as RegistrationDTO;
  
      // Valide se o fullName foi fornecido
      if (!fullName || fullName.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'AUTH002',
            message: 'Full name is required'
          }
        });
      }
  
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'AUTH001',
            message: 'Email already registered'
          }
        });
      }
  
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: {
          email,
          passwordHash,
          fullName // Adicione o campo ao banco de dados
        }
      });
  
      const token = jwt.sign({ userId: newUser.id }, jwtSecret, {
        expiresIn: jwtExpiresIn
      });
  
      return res.status(201).json({
        success: true,
        data: {
          token,
          user: {
            id: newUser.id,
            email: newUser.email,
            fullName: newUser.fullName // Retorne o nome completo na resposta
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body as LoginDTO;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'AUTH004',
            message: 'Invalid credentials'
          }
        });
      }

      const passwordMatch = await bcrypt.compare(password, user.passwordHash);
      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'AUTH004',
            message: 'Invalid credentials'
          }
        });
      }

      const token = jwt.sign({ userId: user.id }, jwtSecret, {
        expiresIn: jwtExpiresIn
      });

      return res.status(200).json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            email: user.email
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async requestAccountDeletion(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ 
          success: false,
          error: {
            code: 'AUTH007',
            message: 'Email é obrigatório'
          }
        });
      }

      // Verificar se o email existe no sistema
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        // Por segurança, não informamos que o email não existe
        return res.status(200).json({
          success: true,
          message: 'Se o email estiver registrado, um link de confirmação será enviado.'
        });
      }

      // Gerar token para confirmação de exclusão
      const token = jwt.sign(
        { userId: user.id, email, action: 'delete-account' },
        config.jwtSecret,
        { expiresIn: '24h' }
      );

      // Enviar email de confirmação
      const confirmationLink = `${config.frontendUrl}/confirm?token=${token}`;
      await emailService.sendAccountDeletionEmail(email, confirmationLink);

      return res.status(200).json({
        success: true,
        message: 'Se o email estiver registrado, um link de confirmação será enviado.'
      });
    } catch (error) {
      console.error('Erro ao solicitar exclusão de conta:', error);
      return res.status(500).json({ 
        success: false,
        error: {
          code: 'AUTH008',
          message: 'Erro ao processar a solicitação de exclusão de conta'
        }
      });
    }
  }

  async confirmAccountDeletion(req: Request, res: Response) {
    try {
      const { token } = req.params;

      // Verificar token
      const decoded = jwt.verify(token, config.jwtSecret) as {
        userId: string;
        email: string;
        action: string;
      };

      if (decoded.action !== 'delete-account') {
        return res.status(400).json({ 
          success: false,
          error: {
            code: 'AUTH009',
            message: 'Token inválido para esta operação'
          }
        });
      }

      // Verificar se o usuário ainda existe
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });

      if (!user) {
        return res.status(404).json({ 
          success: false,
          error: {
            code: 'AUTH010',
            message: 'Usuário não encontrado'
          }
        });
      }

      // Excluir conta do usuário e todos os dados relacionados
      await prisma.$transaction(async (tx) => {
        // Excluir todos os dados relacionados ao usuário
        await tx.message.deleteMany({ where: { userId: decoded.userId } });
        await tx.checkIn.deleteMany({ where: { userId: decoded.userId } });
        await tx.achievement.deleteMany({ where: { userId: decoded.userId } });
        await tx.finance.deleteMany({ where: { userId: decoded.userId } });
        await tx.diaryEntry.deleteMany({ where: { userId: decoded.userId } });
        
        if (await prisma.profile.findFirst({ where: { userId: decoded.userId } })) {
          await tx.profile.delete({ where: { userId: decoded.userId } });
        }
        
        // Por fim, excluir o usuário
        await tx.user.delete({ where: { id: decoded.userId } });
      });

      return res.status(200).json({
        success: true,
        message: 'Sua conta foi excluída com sucesso. Todos os seus dados foram removidos do nosso sistema.'
      });
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(400).json({ 
          success: false,
          error: {
            code: 'AUTH011',
            message: 'Token inválido ou expirado'
          }
        });
      }
      
      console.error('Erro ao confirmar exclusão de conta:', error);
      return res.status(500).json({ 
        success: false,
        error: {
          code: 'AUTH012',
          message: 'Erro ao processar a exclusão da conta'
        }
      });
    }
  }
}
