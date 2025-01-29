// src/server.ts
    import express from 'express';
    import cors from 'cors';
    import dotenv from 'dotenv';
    import authRoutes from './routes/auth.routes';
    import profileRoutes from './routes/profile.routes';
    import { errorHandler } from './middleware/error';

    dotenv.config();

    const app = express();
    const port = process.env.PORT || 3000;

    app.use(cors());
    app.use(express.json());

    app.use('/auth', authRoutes);
    app.use('/profiles', profileRoutes);

    app.use(errorHandler);

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
