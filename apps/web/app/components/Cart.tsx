'use client';

import { useEffect, useState } from "react";
import style from "../style/cart.module.css";
import { FaShoppingCart } from "react-icons/fa";
import { ProductResponseDto } from "../types/productResponse.dto";


export default function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState<ProductResponseDto[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      try {
        setCartItems(JSON.parse(stored));
      } catch (e) {
        console.error("Erreur parsing localStorage cart", e);
      }
    }
  }, [isOpen]); 

  
const handleRemove = (id: number) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return (
    <>
      <div className={style.cartContainer} onClick={() => setIsOpen(true)}>
        <FaShoppingCart size={24} />
      </div>

      <div className={`${style.offCanvas} ${isOpen ? style.open : ""}`}>
        <button className={style.closeButton} onClick={() => setIsOpen(false)}>×</button>
        <h2>Votre panier</h2>
        {cartItems.length === 0 ? (
          <p>Votre panier est vide.</p>
        ) : (
          <ul className={style.cartList}>
            {cartItems.map(item => (
              <li key={item.id} className={style.cartItem}>
                <img src={item.imgPath} alt={item.nom} />
                <div>
                  <h4>{item.nom}</h4>
                  <p>{item.prix.toFixed(2)} €</p>
                  <button className={style.removeButton} onClick={() => handleRemove(item.id)}>Supprimer</button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <button className={style.paymentBtn}> Passer au paiement </button>
      </div>
    </>
  );
}
