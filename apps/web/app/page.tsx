import Image, { type ImageProps } from "next/image";
import HorizontalNavBar from "./components/HorizontalNavBar";
import ProductGallery from "./components/ProductGallery";
import CollectionCarousel from "./components/CollectionsCarousel";
import Footer from "./components/Footer";
import Banner from './components/Banner'



export default function Home() {
  return (
    <>
      <HorizontalNavBar/>
      <Banner/>
      <CollectionCarousel/>
      <ProductGallery/>
      <Footer/>
    </>
  );
}
