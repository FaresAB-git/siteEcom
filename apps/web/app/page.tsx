import Image, { type ImageProps } from "next/image";
import HorizontalNavBar from "./components/HorizontalNavBar";
import ProductGallery from "./components/ProductGallery";
import CollectionCarousel from "./components/CollectionsCarousel";
import Footer from "./components/Footer";
import Banner from './components/Banner'
import NewProducts from "./components/NewProducts";



export default function Home() {
  return (
    <>
      <HorizontalNavBar/>
      <Banner/>
      <CollectionCarousel/>
      <NewProducts/>
      <ProductGallery/>
      <Footer/>
    </>
  );
}
