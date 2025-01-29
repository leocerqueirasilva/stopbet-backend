// src/middleware/auth.ts
    import { Request, Response, NextFunction } from 'express';
    import jwt from 'jsonwebtoken';
    import { jwtSecret } from '../config/jwt';

    interface AuthRequest extends Request {
      user?: {
        userId: string;
      };
    }

    export const authMiddleware = (
      req: AuthRequest,
      res: Response,
      next: NextFunction
    ) => {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'AUTH005',
            message: 'No token provided'
          }
        });
      }

      const token = authHeader.split(' ')[1];

      try {
        const decoded = jwt.verify(token, jwtSecret) as { userId: string };
        req.user = { userId: decoded.userId };
        next();
      } catch (error) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'AUTH006',
            message: 'Invalid token'
          }
        });
      }
    };
