import { ProdDto } from "../types/product.dto";

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

export async function createProduct(product: ProdDto, imageFile: File) {
  // Étape 1: Upload de l'image sur Cloudinary
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
