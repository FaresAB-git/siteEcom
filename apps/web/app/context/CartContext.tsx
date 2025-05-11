// context/CartContext.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { ProductResponseDto } from "../types/productResponse.dto";

type CartItem = {
  product: ProductResponseDto;
  quantity: number;
};

type CartContextType = {
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  cartItems: CartItem[];
  addToCart: (product: ProductResponseDto) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      try {
        setCartItems(JSON.parse(stored));
      } catch (e) {
        console.error("Erreur parsing localStorage cart", e);
      }
    }
  }, []);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addToCart = (product: ProductResponseDto) => {
    const existingItem = cartItems.find(item => item.product.id === product.id);

    let updatedCart;
    if (existingItem) {
      updatedCart = cartItems.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cartItems, { product, quantity: 1 }];
    }

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    openCart();
  };

  const removeFromCart = (id: number) => {
    const updatedCart = cartItems.filter(item => item.product.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const clearCart = () => {
  setCartItems([]);
  localStorage.removeItem('cart');
};


  return (
    <CartContext.Provider value={{ isOpen, openCart, closeCart, cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
