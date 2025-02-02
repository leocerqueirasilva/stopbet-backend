// src/server.ts
    import express from 'express';
    import cors from 'cors';
    import dotenv from 'dotenv';
    import authRoutes from './routes/auth.routes';
    import profileRoutes from './routes/profile.routes';
    import diaryRoutes from './routes/diary.routes';
    import financeRoutes from './routes/finance.routes';
    import achievementRoutes from './routes/achievement.routes';
    import checkInRoutes from './routes/checkin.routes';
    import dashboardRoutes from './routes/dashboard.routes';
    import { errorHandler } from './middleware/error';
    
    dotenv.config();
    
    const app = express();
    const port = process.env.PORT || 3000;
    
    app.use(cors());
    app.use(express.json());
    
    app.use('/auth', authRoutes);
    app.use('/profiles', profileRoutes);
    app.use('/diary', diaryRoutes);
    app.use('/finances', financeRoutes);
    app.use('/achievements', achievementRoutes);
    app.use('/checkins', checkInRoutes);
    app.use('/dashboard', dashboardRoutes);
    
    app.use(errorHandler);
    
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
