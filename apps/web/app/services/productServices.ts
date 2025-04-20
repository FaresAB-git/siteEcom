import { ProdDto } from "../types/product.dto";

export async function createProduct(product: ProdDto){
    const res = await fetch("http://localhost:8000/produit",{
        method:'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(product)
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Erreur lors de la création du produit');
      }
    
      return res.json();
    
}