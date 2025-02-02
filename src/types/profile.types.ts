// src/types/profile.types.ts

    export enum BetType {
      SPORTS = 'SPORTS',
      CASINO = 'CASINO',
      POKER = 'POKER',
      LOTTERY = 'LOTTERY',
      OTHER = 'OTHER'
    }

    export enum BettingFrequency {
      DAILY = 'DAILY',
      WEEKLY = 'WEEKLY',
      MONTHLY = 'MONTHLY',
      OCCASIONALLY = 'OCCASIONALLY'
    }

    export interface CreateProfileDTO {
      betType: BetType;
      bettingFrequency: BettingFrequency;
      bettingMotivation: string;
      continuityAfterLosses: string;
      financialImpact: string;
      stressLevel: string;
      workStudyImpact: string;
      profitLossRecord: string;
      dailyBetValue: string;
      weeklyHoursSpent: string;
    }
