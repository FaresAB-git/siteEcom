import { ProdDto } from "../types/product.dto";
import { ProductResponseDto } from "../types/productResponse.dto";

// export async function createProduct(product: ProdDto){
//     const res = await fetch("http://localhost:8000/produit",{
//         method:'POST',
//         credentials: 'include',
//         headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(product)
//     });

//     if (!res.ok) {
//         const error = await res.json();
//         throw new Error(error.message || 'Erreur lors de la création du produit');
//       }
    
//       return res.json();
    
// }

export async function createProduct(product: ProdDto, imageFile: File|null) {
  if (!imageFile) throw new Error("Image manquante pour la création du produit.");
  
  const formData = new FormData();
  formData.append('file', imageFile);  // "file" doit correspondre au champ du formulaire dans ta route
  formData.append('upload_preset', 'votre_upload_preset');  // Si nécessaire, ajoute un upload preset (selon la config Cloudinary)

  const uploadRes = await fetch("http://localhost:8000/upload", {
      method: 'POST',
      body: formData,
  });

  if (!uploadRes.ok) {
      const error = await uploadRes.json();
      throw new Error(error.message || 'Erreur lors de l\'upload de l\'image');
  }

  const uploadData = await uploadRes.json();
  const imageUrl = uploadData.url;  // URL de l'image retournée par Cloudinary

  // Étape 2: Ajouter l'URL de l'image dans le produit
  const productWithImage = { ...product, imgPath: imageUrl };

  // Étape 3: Création du produit avec l'URL de l'image
  const res = await fetch("http://localhost:8000/produit", {
      method: 'POST',
      credentials: 'include',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(productWithImage),
  });

  if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erreur lors de la création du produit');
  }

  return res.json();
}



export async function getProducts():Promise<ProductResponseDto[]> {
  const response = await fetch("http://localhost:8000/produit", {
    method:'GET',
    headers:{
      'Content-Type': 'application/json',
    }
  });

  const data = await response.json();

  if(!response.ok){
    throw new Error (data.message || 'erreur de connexion');
  }
  return data;
}

export async function getProduct(idProduct: number):Promise<ProductResponseDto> {
  const response = await fetch("http://localhost:8000/produit/" + idProduct, {
    method:'GET',
    headers:{
      'Content-Type': 'application/json',
    }
  });

  const data = await response.json();

  if(!response.ok){
    throw new Error (data.message || 'erreur de connexion');
  }
  return data;
}

export async function updateProduct(id: number, product: ProdDto, imageFile: File | null) {
  let imageUrl = product.imgPath; // on garde l’image actuelle par défaut

  if (imageFile) {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', 'votre_upload_preset'); // adapte si nécessaire

    const uploadRes = await fetch("http://localhost:8000/upload", {
      method: 'POST',
      body: formData,
    });

    if (!uploadRes.ok) {
      const error = await uploadRes.json();
      throw new Error(error.message || 'Erreur lors de l\'upload de la nouvelle image');
    }

    const uploadData = await uploadRes.json();
    imageUrl = uploadData.url;
  }

  const updatedProduct = { ...product, imgPath: imageUrl };

  const res = await fetch(`http://localhost:8000/produit/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedProduct),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Erreur lors de la mise à jour du produit');
  }

  return res.json();
}
