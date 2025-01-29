// src/middleware/validation.ts
    import { Request, Response, NextFunction } from 'express';
    import { validateEmail, validatePassword } from '../utils/validators';
    import { CreateProfileDTO } from '../types/profile.types';

    export const validateRegistration = (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      const { email, password } = req.body;

      if (!validateEmail(email)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'AUTH002',
            message: 'Invalid email format'
          }
        });
      }

      if (!validatePassword(password)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'AUTH003',
            message: 'Password does not meet requirements'
          }
        });
      }

      next();
    };

    export const validateLogin = (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'AUTH007',
            message: 'Email and password are required'
          }
        });
      }

      next();
    };

    export const validateProfile = (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      const profileData = req.body as CreateProfileDTO;

      if (
        !profileData.betType ||
        !profileData.bettingFrequency ||
        !profileData.bettingMotivation ||
        !profileData.continuityAfterLosses ||
        !profileData.financialImpact ||
        !profileData.stressLevel ||
        !profileData.workStudyImpact ||
        profileData.profitLossRecord === undefined ||
        profileData.dailyBetValue === undefined ||
        profileData.weeklyHoursSpent === undefined
      ) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'PROFILE002',
            message: 'All profile fields are required'
          }
        });
      }

      if (typeof profileData.profitLossRecord !== 'number' || typeof profileData.dailyBetValue !== 'number' || typeof profileData.weeklyHoursSpent !== 'number') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'PROFILE003',
            message: 'Invalid data types for numeric fields'
          }
        });
      }

      next();
    };
