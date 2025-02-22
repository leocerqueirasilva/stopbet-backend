// src/controllers/ProfileController.ts
    import { Request, Response, NextFunction } from 'express';
    import prisma from '../config/database';
    import { CreateProfileDTO } from '../types/profile.types';

    export class ProfileController {
      async create(req: Request, res: Response, next: NextFunction) {
        try {
          const { userId } = req.user;
          const profileData = req.body as CreateProfileDTO;

          const newProfile = await prisma.profile.create({
            data: {
              userId,
              ...profileData
            }
          });

          return res.status(201).json({
            success: true,
            data: newProfile
          });
        } catch (error) {
          next(error);
        }
      }

      async getCurrentUserProfile(req: Request, res: Response, next: NextFunction) {
        try {
          const { userId } = req.user;
          
          const profile = await prisma.profile.findUnique({
            where: { userId },
            include: {
              user: {
                select: {
                  email: true,
                  fullName: true
                }
              }
            }
          });
      
          if (!profile) {
            return res.status(404).json({
              success: false,
              error: {
                code: 'PROFILE001',
                message: 'Profile not found'
              }
            });
          }
      
          return res.status(200).json({
            success: true,
            data: profile
          });
        } catch (error) {
          next(error);
        }
      }

      async getProfile(req: Request, res: Response, next: NextFunction) {
        try {
          const { id } = req.params;

          const profile = await prisma.profile.findUnique({
            where: { id }
          });

          if (!profile) {
            return res.status(404).json({
              success: false,
              error: {
                code: 'PROFILE001',
                message: 'Profile not found'
              }
            });
          }

          return res.status(200).json({
            success: true,
            data: profile
          });
        } catch (error) {
          next(error);
        }
      }

      async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
          const { id } = req.params;
          const profileData = req.body as CreateProfileDTO;

          const updatedProfile = await prisma.profile.update({
            where: { id },
            data: profileData
          });

          return res.status(200).json({
            success: true,
            data: updatedProfile
          });
        } catch (error) {
          next(error);
        }
      }

      async deleteProfile(req: Request, res: Response, next: NextFunction) {
        try {
          const { id } = req.params;

          await prisma.profile.delete({
            where: { id }
          });

          return res.status(204).send();
        } catch (error) {
          next(error);
        }
      }
    }
