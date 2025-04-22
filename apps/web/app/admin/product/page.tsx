'use client';
import { useState } from "react";
import { createProduct } from "../../services/productServices" // Importer la fonction de service
import { ProdDto } from "../../types/product.dto"; // Assure-toi que ce chemin est correct
import Header from "../../components/Header";
import NavBar from "../../components/Navbar";
import style from "../../style/productAdmin.module.css"
import Link from "next/link";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleCreateProduct = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const product: ProdDto = {
      nom: "Produit Test",
      description: "Description de test",
      imgPath: "/images/test.jpg",
      prix: 19.99,
      stock: 10
    };

    try {
      await createProduct(product); // Utilisation de la fonction createProduct
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header/>
      <NavBar/>
      <h2 className={style.pageTitle}>Produits</h2>
      <div className={style.mainContent}> 
        <div className={style.container}> 
          <div className={style.btnContainer}> <Link href="/admin/product/addProduct" className={style.addProductBtn}> ajouter produit </Link> </div>
          <div className={style.productTableContainer}> 

          </div>
        </div>
        
      </div>
      
    </>
  );
}
