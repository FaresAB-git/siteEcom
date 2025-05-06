'use client'
import style from "../style/btnCart.module.css"
import { ProductResponseDto } from "../types/productResponse.dto";

type BtnCartProps = {
    product: ProductResponseDto;
  };

 export default function BtnCart({ product }: BtnCartProps) {

    function addToCart() {
        const cartString = localStorage.getItem("cart");
        const cart = cartString ? JSON.parse(cartString) : [];
    
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
        
      }
  return(
    
    <>
    <button className={style.panierBtn} onClick={addToCart}> Ajouter au panier </button>
    </>
  ); 

}
