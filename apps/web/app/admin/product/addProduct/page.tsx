'use client';
import Header from "../../../components/Header";
import NavBar from "../../../components/Navbar";
import ProductForm from "../../../components/ProductForm";
import style from "../../../style/addProduct.module.css";
import { createProduct } from "../../../services/productServices";
import { ProdDto } from "../../../types/product.dto";
import { useRouter } from 'next/navigation';

export default function CreateProductPage() {
  const router = useRouter();

  const handleSubmit = async (product: ProdDto, image: File | null) => {
    try {
      await createProduct(product, image);
      router.push('/admin/product');
    } catch (error) {
      console.error("Erreur lors de la création du produit:", error);
      alert("Erreur lors de la création du produit.");
    }
  };

  return (
    <>
      <Header />
      <NavBar />
        <ProductForm
          mode="create"
          onSuccess={() => router.push('/admin/product')}
        />
    </>
  );
}
