import Image, { type ImageProps } from "next/image";
import HorizontalNavBar from "../../components/HorizontalNavBar";
import ProductGallery from "../../components/ProductsFromCollection";


type Params = Promise<{ id: string }>

export default async function CollectionProducts({params}: { params: Params }) {
  const resolvedParams = await params;

  const id = parseInt(resolvedParams.id, 10);
  

  if (isNaN(id)) {
    throw new Error('Invalid product ID');
  }
  
  return (
    <>
      <HorizontalNavBar/>
      <ProductGallery collectionId={id}/>
      
    </>
  );
}
