export type CommandeResponseDto = {
  id: number;
  userId?: number;
  clientEmail?: string;
  adresse: string;
  codePostal?: string;
  ville?: string;
  pays?: string;
  total: number;
  status: string;
  createdAt: string; 
};