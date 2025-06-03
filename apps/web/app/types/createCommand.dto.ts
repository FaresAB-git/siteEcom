export interface CreateCommandeDto {
    userId?: number;
    clientEmail: string;
    adresse: string;
    total: number; 
    status?: string; 
  }
  