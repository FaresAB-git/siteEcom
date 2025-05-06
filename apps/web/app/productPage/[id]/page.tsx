//composant serveur
import BtnCart from "../../components/BtnCart";
import HorizontalNavBar from "../../components/HorizontalNavBar";
import { getProduct } from "../../services/productServices";
import style from "../../style/productPage.module.css"
import { ProductResponseDto } from "../../types/productResponse.dto";

export default async function ProductPage({ params }: { params: { id: string } }) { 
 
  const resolvedParams = await params;

  const id = parseInt(resolvedParams.id, 10);

  if (isNaN(id)) {
    throw new Error('Invalid product ID');
  }
  
  const product: ProductResponseDto = await getProduct(id);

 
  return (
    <>
    <HorizontalNavBar/>
    <div className={style.container}> 
      <div className={style.imageContainer}>
        <img src={product.imgPath} alt={`Image de ${product.nom}`} className={style.prodImg} />
      </div>
      <div className={style.textContainer}>
        <h1 className={style.productName}> {product.nom} </h1>
        <h2 className={style.productPrice}> {product.prix} € </h2>
        <p className={style.productDesc}> {product.description} </p>
        <div> 
          <BtnCart product={product}/>
        </div>
      </div>
    </div>
    </>
  );
  
}
