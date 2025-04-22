'use client';
import { useState } from "react";
import style from "../../../style/addProduct.module.css"
import Link from "next/link";
import Header from "../../../components/Header";
import NavBar from "../../../components/Navbar";
import { ProdDto } from "../../../types/product.dto";
import { createProduct } from "../../../services/productServices";

export default function Home() {
  
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [prix, setPrix] = useState("");
  const [qte, setQte] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleForm = async (e: React.FormEvent) => {
    e.preventDefault(); 
    
    if (!titre || !description || !prix || !qte || !image) {
      alert("Veuillez remplir tous les champs, y compris l'image.");
      return;
    }

    const product: ProdDto = {
      nom: titre,
      description,
      imgPath: "", //remplis dans createProduct 
      prix: parseFloat(prix),
      stock: parseInt(qte),
    };

    try {
      const result = await createProduct(product, image);
      console.log("Produit créé:", result);
    } catch (error) {
      console.error("Erreur lors de la création du produit:", error);
      alert("Erreur lors de la création du produit.");
    }
  };


  return (
    <>
      <Header/>
      <NavBar/>
      <h2 className={style.pageTitle}>Produits</h2>
      <div className={style.mainContent}> 
        <div className={style.container}> 
          <form className={style.productForm} onSubmit={handleForm}>
            <label> Titre </label>
            <input type="text" className={`${style.titreInput} ${style.input}`} value={titre} onChange={(e) => setTitre(e.target.value)}></input>
            <label> Description </label>
            <textarea rows={6} className={`${style.descInput}`} value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            <label> Image </label>
            <input type="file" className={`${style.imgInput}`} onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setImage(file);
            }}></input>
            <label> Prix </label>
            <input type="number" className={`${style.prixInput} ${style.input}`} value={prix} onChange={(e) => setPrix(e.target.value)}></input>
            <label> Quantité stock </label>
            <input type="number" className={`${style.qteInput} ${style.input}`} value={qte} onChange={(e) => setQte(e.target.value)}></input>
            <button type="submit" className={style.submitButton}>Créer le produit</button>
          </form>
        </div>
        
      </div>
    </>
  );
}
