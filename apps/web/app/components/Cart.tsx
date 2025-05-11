// Cart.tsx
'use client';

import style from "../style/cart.module.css";
import { FaShoppingCart } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { isOpen, openCart, closeCart, cartItems, removeFromCart } = useCart();

  const router = useRouter();

  return (
    <>
      <div className={style.cartContainer} onClick={openCart}>
        <FaShoppingCart size={24} />
      </div>

      <div className={`${style.offCanvas} ${isOpen ? style.open : ""}`}>
        <button className={style.closeButton} onClick={closeCart}>×</button>
        <h2>Votre panier</h2>
        {cartItems.length === 0 ? (
          <p>Votre panier est vide.</p>
        ) : (
          <ul className={style.cartList}>
            {cartItems.map(({ product, quantity }) => (
              <li key={product.id} className={style.cartItem}>
                <img src={product.imgPath} alt={product.nom} />
                <div>
                  <h4>{product.nom}</h4>
                  <p>{product.prix.toFixed(2)} €</p>
                  <p>Quantité : {quantity}</p>
                  <button
                    className={style.removeButton}
                    onClick={() => removeFromCart(product.id)}
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <button className={style.paymentBtn} onClick={() => router.push("/payment")}>
          Passer au paiement
        </button>
      </div>
    </>
  );
}
