'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from "../../../../components/Header";
import NavBar from "../../../../components/Navbar";
import { getProduct } from "../../../../services/productServices";
import { ProdDto } from '../../../../types/product.dto';
import ProductForm from '../../../../components/ProductForm';
import { ProductResponseDto } from '../../../../types/productResponse.dto';

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<ProductResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProduct(Number(id));
        setProduct(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;
  if (!product) return <p>Produit introuvable.</p>;

  return (
    <>
      <Header />
      <NavBar />
      <h2 style={{ textAlign: 'center', marginTop: '1rem' }}>Modifier un produit</h2>
      <ProductForm mode="edit" initialData={product} onSuccess={() => router.push('/admin/product')} />
    </>
  );
}
