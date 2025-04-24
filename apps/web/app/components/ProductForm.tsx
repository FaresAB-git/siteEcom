'use client';
import { useState, useEffect } from "react";
import style from "../style/addProduct.module.css";
import { ProdDto } from "../types/product.dto";
import { createProduct, updateProduct } from "../services/productServices";
import { ProductResponseDto } from "../types/productResponse.dto";

type ProductFormProps = {
  mode: 'create' | 'edit';
  initialData?: ProductResponseDto;
  onSuccess: () => void;
};

export default function ProductForm({ mode, initialData, onSuccess }: ProductFormProps) {
  const [titre, setTitre] = useState(initialData?.nom || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [prix, setPrix] = useState(initialData?.prix?.toString() || "");
  const [qte, setQte] = useState(initialData?.stock?.toString() || "");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const product: ProdDto = {
      nom: titre,
      description,
      imgPath: initialData?.imgPath || "", // utile pour l'édition
      prix: parseFloat(prix),
      stock: parseInt(qte),
    };

    try {
      if (mode === "create") {
        if (!image) {
          alert("Veuillez sélectionner une image.");
          return;
        }
        await createProduct(product, image);
      } else {
        await updateProduct(initialData!.id, product, image); 
      }
      onSuccess();
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue.");
    }
  };

  return (
    <div className={style.mainContent}>
      <div className={style.container}>
        <form className={style.productForm} onSubmit={handleSubmit}>
          <label>Titre</label>
          <input type="text" className={style.input} value={titre} onChange={(e) => setTitre(e.target.value)} />
          <label>Description</label>
          <textarea rows={6} className={style.descInput} value={description} onChange={(e) => setDescription(e.target.value)} />
          <label>Image</label>
          <input type="file" className={style.imgInput} onChange={(e) => setImage(e.target.files?.[0] || null)} />
          <label>Prix</label>
          <input type="number" className={style.input} value={prix} onChange={(e) => setPrix(e.target.value)} />
          <label>Quantité stock</label>
          <input type="number" className={style.input} value={qte} onChange={(e) => setQte(e.target.value)} />
          <button type="submit" className={style.submitButton}>
            {mode === 'edit' ? 'Modifier le produit' : 'Créer le produit'}
          </button>
        </form>
      </div>
    </div>
  );
}
