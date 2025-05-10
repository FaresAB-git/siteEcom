
import style from "../../../style/productAdmin.module.css"
import Header from "../../../components/Header";
import NavBar from "../../../components/Navbar";
import { ProductResponseDto } from "../../../types/productResponse.dto";
import { getProductsByCommandId } from "../../../services/commandServices";


export default async function Command({ params }: { params: { id: string } }){
  
    const {id} = await params
    console.log(id);

    const commandId = parseInt(id, 10);

    if (isNaN(commandId)) {
        throw new Error('Invalid product ID');
    }

      
      const products: ProductResponseDto[] = await getProductsByCommandId(commandId);
      console.log(products);

    return(
        <>
        <Header/>
        <NavBar/>

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
              {products.map((product: ProductResponseDto) => (
                <tr
                  key={product.id}
                  className={style.clickableRow}
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