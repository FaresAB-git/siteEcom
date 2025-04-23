'use client';
import { useState, useEffect } from "react";
import { createProduct } from "../../services/productServices" 
import Header from "../../components/Header";
import NavBar from "../../components/Navbar";
import style from "../../style/productAdmin.module.css"
import Link from "next/link";
import { getProducts } from "../../services/productServices";
import { ProductResponseDto } from "../../types/productResponse.dto";
import { useRouter } from "next/navigation"; 

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() =>{
    const fetchProducts = async () => {
      try {
        const data: any = await getProducts();
        setProducts(data);
      } catch (err:any) {
        setError(err.message);
      }
    };
    fetchProducts();
    
  }, [])
  

  return (
    <>
      <Header/>
      <NavBar/>
      <h2 className={style.pageTitle}>Produits</h2>
      <div className={style.mainContent}> 
        <div className={style.container}> 
          <div className={style.btnContainer}> <Link href="/admin/product/addProduct" className={style.addProductBtn}> ajouter produit </Link> </div>
          <div className={style.productTableContainer}> 
          <table className={style.productTable}>
            <thead className={style.tableHead}>
              <tr>
                <th className={style.tableCell}>Produit</th>
                <th className={style.tableCell}>Image</th>
                <th className={style.tableCell}>Stock</th>
                <th className={style.tableCell}>Prix</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product: ProductResponseDto) => (
                <tr
                  key={product.id}
                  className={style.clickableRow}
                  onClick={() => router.push(`/admin/product/editProduct/${product.id}`)}
                >
                  <td className={`${style.tableCell} ${style.rowBorder}`}>{product.nom}</td>
                  <td className={`${style.tableCell} ${style.rowBorder}`}>
                    <img src={product.imgPath} alt={product.nom} />
                  </td>
                  <td className={`${style.tableCell} ${style.rowBorder}`}>{product.stock}</td>
                  <td className={`${style.tableCell} ${style.rowBorder}`}>{product.prix} €</td>
                </tr>
              ))}
            </tbody>

          </table>
          </div>
        </div>
        
      </div>
      
    </>
  );
}
