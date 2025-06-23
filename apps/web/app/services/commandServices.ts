import { API_URL } from "../../lib/api";
import { CommandeResponseDto } from "../types/commandResponse.dto";
import { CreateCommandeWithProduitsDto } from "../types/CreateCommandeWithProduits.dto";
import { ProductResponseDto } from "../types/productResponse.dto";

export async function createCommande(data: CreateCommandeWithProduitsDto) {
  try {
    const response = await fetch(`${API_URL}/commande`, {
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

export async function getCommands(): Promise<CommandeResponseDto[]> {
  try {
    const response = await fetch(`${API_URL}/commande`, {
      method: 'GET',
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la récupération des commandes');
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error('Erreur dans getCommands:', error);
    throw error;
  }
}

export async function getProductsByCommandId(productId: number): Promise<ProductResponseDto[]> {
  try {
    const response = await fetch(`${API_URL}/commande/produits/${productId}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la récupération des produits');
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error('Erreur dans getProductsByCommandId:', error);
    throw error;
  }
}
