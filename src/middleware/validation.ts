// src/middleware/validation.ts
    import { Request, Response, NextFunction } from 'express';
    import { validateEmail, validatePassword } from '../utils/validators';
    import { CreateProfileDTO } from '../types/profile.types';
    import { CreateDiaryDTO } from '../types/diary.types';
    import { CreateFinanceDTO } from '../types/finance.types';
    import { CreateCheckInDTO } from '../types/checkin.types';
    
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
    
      next();
    };
    
    export const validateDiaryEntry = (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      const { content, status } = req.body as CreateDiaryDTO;
    
      if (!content || !status) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'DIARY002',
            message: 'Content and status are required'
          }
        });
      }
    
      if (!['RELAPSE', 'WILLPOWER', 'SUCCESS'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'DIARY003',
            message: 'Invalid status value'
          }
        });
      }
    
      next();
    };
    
    export const validateFinance = (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      const { type, amount, description } = req.body as CreateFinanceDTO;
    
      if (!type || !amount || !description) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'FINANCE002',
            message: 'Type, amount and description are required'
          }
        });
      }
    
      if (!['SAVING', 'EXPENSE'].includes(type)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'FINANCE003',
            message: 'Invalid finance type'
          }
        });
      }
    
      if (typeof amount !== 'number') {
        return res.status(400).json({
          success: false,
          error: {
            code: 'FINANCE004',
            message: 'Amount must be a number'
          }
        });
      }
    
      next();
    };
    
    export const validateCheckIn = (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      const { type } = req.body as CreateCheckInDTO;
    
      if (!type) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'CHECKIN002',
            message: 'Type is required'
          }
        });
      }
    
      if (!['DAILY', 'EMERGENCY'].includes(type)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'CHECKIN003',
            message: 'Invalid check-in type'
          }
        });
      }
    
      next();
    };
