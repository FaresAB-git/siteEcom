'use client';

import style from "../style/btnCart.module.css";
import { ProductResponseDto } from "../types/productResponse.dto";
import { useCart } from "../context/CartContext"

type BtnCartProps = {
  product: ProductResponseDto;
};

export default function BtnCart({ product }: BtnCartProps) {
  const { addToCart } = useCart();

  return (
    <button className={style.panierBtn} onClick={() => addToCart(product)}>
      Ajouter au panier
    </button>
  );
}
