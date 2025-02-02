// src/types/achievement.types.ts
    export interface Achievement {
      id: string;
      type: 'WEEK_CLEAN' | 'MONTH_CLEAN' | 'YEAR_CLEAN';
      status: 'LOCKED' | 'IN_PROGRESS' | 'COMPLETED';
      progress: number;
      earnedAt: Date | null;
    }
