'use client';

import { useEffect, useState } from 'react';
import styles from "../style/payment.module.css";
import { ProductResponseDto } from '../types/productResponse.dto';
import { useRouter } from 'next/navigation';
import { createCommande } from '../services/commandServices';

export default function CheckoutPage() {
  const [cart, setCart] = useState<ProductResponseDto[]>([]);
  const [email, setEmail] = useState('');
  const [adresse, setAdresse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      try {
        const parsedCart: ProductResponseDto[] = JSON.parse(cartData);
        setCart(parsedCart);
      } catch (err) {
        console.error("Erreur lors du parsing du panier:", err);
      }
    }
  }, []);

  const total = cart.reduce((sum, item) => sum + item.prix, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const dto = {
        commande: {
          clientEmail: email,
          total,
          status: 'en attente',
        },
        produits: cart.map((item) => ({
          produitId: item.id,
          quantite: 1, // à adapter si tu gères la quantité ailleurs
          prixUnitaire: item.prix,
        })),
      };

      const result = await createCommande(dto);
      console.log("Commande créée :", result);

      localStorage.removeItem('cart');
      //router.push('/successPayment'); 
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
          <label>Adresse postale</label>
          <textarea
            required
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
          ></textarea>
        </div>

        <div className={styles.inputGroup}>
          <label>Numéro de carte bancaire</label>
          <input type="text" required maxLength={19} placeholder="1234 5678 9012 3456" />
        </div>

        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label>Date d'expiration</label>
            <input type="text" required placeholder="MM/AA" />
          </div>
          <div className={styles.inputGroup}>
            <label>CVC</label>
            <input type="text" required maxLength={4} placeholder="123" />
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
            {cart.map((product) => (
              <li key={product.id} className={styles.cartItem}>
                <img src={product.imgPath} className={styles.productSummaryImg} />
                <div>
                  <p className={styles.productName}>{product.nom}</p>
                  <p className={styles.productDesc}>{product.description}</p>
                </div>
                <span>{product.prix.toFixed(2)} €</span>
              </li>
            ))}
          </ul>
        )}
        <div className={styles.total}>Total : {total.toFixed(2)} €</div>
      </aside>
    </div>
  );
}
