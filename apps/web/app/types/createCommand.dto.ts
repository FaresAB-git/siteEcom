export interface CreateCommandeDto {
    userId?: number;
    clientNom?: string;
    clientEmail?: string;
    total: number; // devrait être >= 0 et max 2 décimales (à valider côté client si nécessaire)
    status?: string; // par défaut : "en attente"
  }
  