'use client';

import { useEffect, useState } from 'react';
import styles from "../style/payment.module.css";
import { ProductResponseDto } from '../types/productResponse.dto';
import { useRouter } from 'next/navigation';
import { createCommande } from '../services/commandServices';
import { useCart } from '../context/CartContext';

type CartItem = {
  product: ProductResponseDto;
  quantity: number;
};

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [email, setEmail] = useState('');
  const [rue, setRue] = useState('');
  const [codePostal, setCodePostal] = useState('');
  const [ville, setVille] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { clearCart } = useCart();

  useEffect(() => {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      try {
        const parsedCart: CartItem[] = JSON.parse(cartData);
        const validCart = parsedCart.filter(item => item?.product && item?.quantity);
        setCart(validCart);
      } catch (err) {
        console.error("Erreur lors du parsing du panier:", err);
      }
    }
  }, []);

  const total = cart.reduce((sum, item) => sum + item.product.prix * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const adresse = `${rue.trim()} ${codePostal.trim()} ${ville.trim()}`;
    const user = localStorage.getItem("user"); //retourne l'objet en string
    console.log(user);
    const userId = user ? JSON.parse(user).id : null  //recupere l'id
    console.log(userId);

    try {
      const dto = {
        commande: {
          userId: userId,
          clientEmail: email,
          total: parseFloat(total.toFixed(2)),
          adresse,
          status: 'en attente',
        },
        produits: cart.map((item) => ({
          produitId: item.product.id,
          quantite: item.quantity,
          prixUnitaire: item.product.prix,
        })),
      };

      const result = await createCommande(dto);
      console.log("Commande créée :", result);

      clearCart();
      //router.push('/');
    } catch (err) {
      console.error("Erreur lors de la création de la commande :", err);
      alert("Une erreur est survenue lors du paiement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Informations de paiement</h2>

        <div className={styles.inputGroup}>
          <label>Adresse Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Rue</label>
          <input
            type="text"
            required
            value={rue}
            onChange={(e) => setRue(e.target.value)}
            placeholder="Ex: 26 bis avenue de Loverchy"
          />
        </div>

        <div className={styles.row}>
          <div className={styles.inputGroup} style={{ flex: 1 }}>
            <label>Code postal</label>
            <input type="text" placeholder="75000" />
          </div>
          <div className={styles.inputGroup} style={{ flex: 1 }}>
            <label>Ville</label>
            <input type="text" placeholder="Paris" />
          </div>
        </div>
        
        <div className={styles.inputGroup}>
          <label>Numéro de carte bancaire</label>
          <input type="text" maxLength={19} placeholder="1234 5678 9012 3456" />
        </div>

        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label>Date d'expiration</label>
            <input type="text" placeholder="MM/AA" />
          </div>
          <div className={styles.inputGroup}>
            <label>CVC</label>
            <input type="text" maxLength={4} placeholder="123" />
          </div>
        </div>

        <button type="submit" className={styles.button} disabled={isSubmitting}>
          {isSubmitting ? 'Paiement en cours...' : `Payer ${total.toFixed(2)} €`}
        </button>
      </form>

      <aside className={styles.summary}>
        <h3>Votre commande</h3>
        {cart.length === 0 ? (
          <p>Votre panier est vide.</p>
        ) : (
          <ul className={styles.cartList}>
            {cart.map(({ product, quantity }) => (
              <li key={product.id} className={styles.cartItem}>
                <img src={product.imgPath} className={styles.productSummaryImg} />
                <div>
                  <p className={styles.productName}>{product.nom}</p>
                  <p className={styles.productDesc}>{product.description}</p>
                  <p>Quantité : {quantity}</p>
                </div>
                <span>{(product.prix * quantity).toFixed(2)} €</span>
              </li>
            ))}
          </ul>
        )}
        <div className={styles.total}>Total : {total.toFixed(2)} €</div>
      </aside>
    </div>
  );
}
