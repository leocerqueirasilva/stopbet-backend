// src/controllers/AuthController.ts
    import { Request, Response, NextFunction } from 'express';
    import bcrypt from 'bcryptjs';
    import jwt from 'jsonwebtoken';
    import prisma from '../config/database';
    import { jwtSecret, jwtExpiresIn } from '../config/jwt';
    import { RegistrationDTO, LoginDTO } from '../types/auth.types';

    export class AuthController {
      async register(req: Request, res: Response, next: NextFunction) {
        try {
          const { email, password } = req.body as RegistrationDTO;

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
              passwordHash
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
                email: newUser.email
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
    }
