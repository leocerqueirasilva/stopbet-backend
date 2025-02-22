// src/types/auth.types.ts
    export interface RegistrationDTO {
      email: string;
      password: string;
      fullName: string;
    }

    export interface LoginDTO {
      email: string;
      password: string;
    }
