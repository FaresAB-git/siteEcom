// app/admin/command/[id]/page.tsx
import style from "../../../style/productAdmin.module.css";
import Header from "../../../components/Header";
import NavBar from "../../../components/Navbar";
import { ProductResponseDto } from "../../../types/productResponse.dto";
import { getProductsByCommandId } from "../../../services/commandServices";


type Params = Promise<{ id: string }>

export default async function CommandPage({ params }: { params: Params }) {
  // await la promesse params
  const { id } = await params

  const commandId = parseInt(id,10)
  const products: ProductResponseDto[] = await getProductsByCommandId(commandId);

  return (
    <>
      <Header />
      <NavBar />

      <h2 className={style.pageTitle}>Produits</h2>
      <div className={style.mainContent}>
        <div className={style.container}>
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
                {products.map((product) => (
                  <tr key={product.id} className={style.clickableRow}>
                    <td className={`${style.tableCell} ${style.rowBorder}`}>
                      {product.nom}
                    </td>
                    <td className={`${style.tableCell} ${style.rowBorder}`}>
                      <img src={product.imgPath} alt={product.nom} />
                    </td>
                    <td className={`${style.tableCell} ${style.rowBorder}`}>
                      {product.stock}
                    </td>
                    <td className={`${style.tableCell} ${style.rowBorder}`}>
                      {product.prix} €
                    </td>
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
