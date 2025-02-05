// src/types/achievement.types.ts
export type AchievementType = 
  | 'DAY_CLEAN'
  | 'TWO_DAYS_CLEAN'
  | 'WEEK_CLEAN'
  | 'THREE_WEEKS_CLEAN'
  | 'MONTH_CLEAN'
  | 'SIX_MONTHS_CLEAN';

export interface Achievement {
  id: string;
  name: string;
  icon: string;
  days: number;
  description: string;
  type: AchievementType;
  status: 'LOCKED' | 'IN_PROGRESS' | 'COMPLETED';
  earnedAt: Date | null;
}

// Adicionar interface para achievements padrão
export const DEFAULT_ACHIEVEMENTS = [
  {
    name: "Primeiro Dia",
    icon: "1day",
    days: 1,
    description: "Complete 1 dia sem apostas",
    type: "DAY_CLEAN"
  },
  {
    name: "Dois Dias",
    icon: "2day",
    days: 2,
    description: "Complete 2 dias sem apostas",
    type: "TWO_DAYS_CLEAN"
  },
  {
    name: "Uma Semana",
    icon: "1week",
    days: 7,
    description: "Complete 7 dias sem apostas",
    type: "WEEK_CLEAN"
  },
  {
    name: "Três Semanas",
    icon: "3week",
    days: 21,
    description: "Complete 21 dias sem apostas",
    type: "THREE_WEEKS_CLEAN"
  },
  {
    name: "Um Mês",
    icon: "1month",
    days: 30,
    description: "Complete 30 dias sem apostas",
    type: "MONTH_CLEAN"
  },
  {
    name: "Seis Meses",
    icon: "6month",
    days: 180,
    description: "Complete 180 dias sem apostas",
    type: "SIX_MONTHS_CLEAN"
  }
] as const;