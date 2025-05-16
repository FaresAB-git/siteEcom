'use client';
import { useState, useEffect } from "react";
import { createProduct, getProducts, updateProduct } from "../../services/productServices";
import Header from "../../components/Header";
import NavBar from "../../components/Navbar";
import style from "../../style/productAdmin.module.css";
import Link from "next/link";
import { ProductResponseDto } from "../../types/productResponse.dto";
import { useRouter } from "next/navigation";
import { getPrevisionStock } from "../../services/dashboardServices";


export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductResponseDto[]>([]);
  const [modifiedStocks, setModifiedStocks] = useState<{ [key: number]: number }>({});
  const [stockForecast, setStockForecast] = useState<{ [key: number]: number }>({});
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

    const fetchForecast = async () => {
      try {
        const forecasts = await getPrevisionStock();
        const forecastMap: { [key: number]: number } = {};
        forecasts.forEach((item: any) => {
          forecastMap[item.id] = item.joursRestants;
        });
        setStockForecast(forecastMap);
      } catch (err: any) {
        console.error("Erreur de prévision de stock :", err);
      }
    };

    fetchProducts();
    fetchForecast();
  }, []);

  const handleStockChange = (id: number, newStock: number) => {
    setModifiedStocks((prev) => ({ ...prev, [id]: newStock }));
  };

  const handleSave = async (product: ProductResponseDto) => {
    const newStock = modifiedStocks[product.id];
    if (newStock === undefined) return;

    try {
      await updateProduct(product.id, { ...product, stock: newStock }, null);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, stock: newStock } : p
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

  const renderStockStatus = (joursRestants: number | undefined) => {
    if (joursRestants === undefined) return null;
    let color = "gray";
    if (joursRestants <= 7) color = "red";
    else if (joursRestants <= 30) color = "orange";
    else color = "green";

    return (
      <span
        title={`${joursRestants === Infinity ? "Stock stable" : joursRestants + "j restants"}`}
        style={{
          display: "inline-block",
          width: 12,
          height: 12,
          borderRadius: "50%",
          backgroundColor: color,
          margin: "0 auto",
        }}
      ></span>
    );
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
                  <th className={style.tableCell}>Prévision</th>
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
                      {renderStockStatus(stockForecast[product.id])}
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
