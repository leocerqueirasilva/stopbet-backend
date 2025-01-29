// src/middleware/error.ts
    import { Request, Response, NextFunction } from 'express';

    export const errorHandler = (
      error: any,
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      console.error(error);

      return res.status(error.status || 500).json({
        success: false,
        error: {
          code: error.code || 'SERVER_ERROR',
          message: error.message || 'Internal server error'
        }
      });
    };
