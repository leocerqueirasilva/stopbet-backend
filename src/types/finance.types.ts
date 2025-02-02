// src/types/finance.types.ts
    export interface Finance {
      id: string;
      type: 'SAVING' | 'EXPENSE';
      amount: number;
      description: string;
      date: Date;
      createdAt: Date;
      updatedAt: Date;
    }
    
    export interface CreateFinanceDTO {
      type: "SAVING" | "EXPENSE";
      amount: number;
      description: string;
      date?: Date;
    }
