// src/config/jwt.ts
    import dotenv from 'dotenv';
    dotenv.config();

    export const jwtSecret = process.env.JWT_SECRET || 'default-secret';
    export const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1d';
