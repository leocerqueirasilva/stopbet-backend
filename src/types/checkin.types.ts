// src/types/checkin.types.ts
    export interface CheckIn {
      id: string;
      type: 'DAILY' | 'EMERGENCY';
      notes?: string;
      createdAt: Date;
    }
    
    export interface CreateCheckInDTO {
      type: "DAILY" | "EMERGENCY";
      notes?: string;
    }
