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
