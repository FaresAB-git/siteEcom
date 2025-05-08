import Image, { type ImageProps } from "next/image";
import HorizontalNavBar from "../../components/HorizontalNavBar";
import ProductGallery from "../../components/ProductsFromCollection";




export default async function CollectionProducts({ params }: { params: { id: string } }) {
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
