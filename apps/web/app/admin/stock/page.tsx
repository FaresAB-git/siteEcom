'use client';
import { useState, useEffect } from "react";
import { createProduct, getProducts, updateProduct } from "../../services/productServices";
import Header from "../../components/Header";
import NavBar from "../../components/Navbar";
import style from "../../style/productAdmin.module.css";
import Link from "next/link";
import { ProductResponseDto } from "../../types/productResponse.dto";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductResponseDto[]>([]);
  const [modifiedStocks, setModifiedStocks] = useState<{ [key: number]: number }>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data: any = await getProducts();
        setProducts(data);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchProducts();
  }, []);

  const handleStockChange = (id: number, newStock: number) => {
    setModifiedStocks((prev) => ({ ...prev, [id]: newStock }));
  };

  const handleSave = async (product: ProductResponseDto) => {
  const newStock = modifiedStocks[product.id];
  if (newStock === undefined) return; // sécurité : ne rien faire si pas de modif

  try {
    await updateProduct(product.id, { ...product, stock: newStock }, null);

    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id ? { ...p, stock: newStock as number } : p
      )
    );

    setModifiedStocks((prev) => {
      const updated = { ...prev };
      delete updated[product.id];
      return updated;
    });
  } catch (err: any) {
    setError(err.message);
  }
};


  return (
    <>
      <Header />
      <NavBar />
      <h2 className={style.pageTitle}>Stock</h2>
      <div className={style.mainContent}>
        <div className={style.container}>
          <div className={style.productTableContainer}>
            <table className={style.productTable}>
              <thead className={style.tableHead}>
                <tr>
                  <th className={style.tableCell}>Produit</th>
                  <th className={style.tableCell}>Image</th>
                  <th className={style.tableCell}>Stock</th>
                  <th className={style.tableCell}>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className={style.clickableRow}>
                    <td className={`${style.tableCell} ${style.rowBorder}`}>{product.nom}</td>
                    <td className={`${style.tableCell} ${style.rowBorder}`}>
                      <img src={product.imgPath} alt={product.nom} width="80" />
                    </td>
                    <td className={`${style.tableCell} ${style.rowBorder}`}>
                      <input
                        type="number"
                        defaultValue={product.stock}
                        onChange={(e) =>
                          handleStockChange(product.id, parseInt(e.target.value))
                        }
                      />
                    </td>
                    <td className={`${style.tableCell} ${style.rowBorder}`}>
                      {modifiedStocks[product.id] !== undefined &&
                        modifiedStocks[product.id] !== product.stock && (
                          <button onClick={() => handleSave(product)}>Save</button>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        </div>
      </div>
    </>
  );
}
