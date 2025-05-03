import Image, { type ImageProps } from "next/image";
import HorizontalNavBar from "./components/HorizontalNavBar";
import ProductGallery from "./components/ProductGallery";



export default function Home() {
  return (
    <>
      <HorizontalNavBar/>
      <ProductGallery/>
      
    </>
  );
}
