import HorizontalNavBar from "../components/HorizontalNavBar";
import ProductGallery from "../components/ProductGallery";

export default function Catalogue(){


    return(
        <>
        <HorizontalNavBar/>
        <ProductGallery filter={true}/>
        </>
    );
}