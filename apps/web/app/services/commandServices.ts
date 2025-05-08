import { CreateCommandeWithProduitsDto } from "../types/CreateCommandeWithProduits.dto";


export async function createCommande(data: CreateCommandeWithProduitsDto) {
  try {
    const response = await fetch('http://localhost:8000/commande', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la création de la commande');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Erreur dans createCommande:', error);
    throw error;
  }
}
