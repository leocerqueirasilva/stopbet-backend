// src/types/diary.types.ts
    export interface DiaryEntry {
      id: string;
      content: string;
      status: 'RELAPSE' | 'WILLPOWER' | 'SUCCESS';
      date: Date;
      createdAt: Date;
      updatedAt: Date;
    }
    
    export interface CreateDiaryDTO {
      content: string;
      status: "RELAPSE" | "WILLPOWER" | "SUCCESS";
      triggers: string[];
    }
