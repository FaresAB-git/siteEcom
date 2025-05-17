import Image, { type ImageProps } from "next/image";
import HorizontalNavBar from "./components/HorizontalNavBar";
import ProductGallery from "./components/ProductGallery";
import CollectionCarousel from "./components/CollectionsCarousel";
import Footer from "./components/Footer";



export default function Home() {
  return (
    <>
      <HorizontalNavBar/>
      <CollectionCarousel/>
      <ProductGallery/>
      <Footer/>
    </>
  );
}
