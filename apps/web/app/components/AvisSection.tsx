"use client";

import { useState } from "react";
import { AvisResponse } from "../types/AvisResponse";
import { CreateAvis } from "../types/CreateAvis";
import { createAvis } from "../services/avisService";
import styles from '../style/AvisSection.module.css'


interface AvisSectionProps {
  productId: number;
  initialAvis: AvisResponse[];
}

export default function AvisSection({ productId, initialAvis }: AvisSectionProps) {
  const [avisList, setAvisList] = useState<AvisResponse[]>(initialAvis || []);
  const [note, setNote] = useState<number>(5);
  const [commentaire, setCommentaire] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async () => {
    if (note < 1 || note > 5) {
      setError("La note doit être comprise entre 1 et 5.");
      return;
    }

    try {
      const newAvis: CreateAvis = {
        produitId: productId,
        note,
        commentaire: commentaire || undefined,
      };

      const avis = await createAvis(newAvis);
      setAvisList((prev) => [...prev, avis]);
      setNote(5);
      setCommentaire("");
      setError("");
    } catch (e: any) {
      setError(e.message || "Erreur lors de l’envoi de l’avis.");
    }
  };

  return (
    <div className={styles.avisContainer}>
      <h3 className={styles.avisTitle}>Avis des utilisateurs</h3>

      {avisList.length === 0 && <p>Aucun avis pour ce produit.</p>}
      {avisList.map((avis) => (
        <div key={avis.id} className={styles.avisItem}>
          <strong>Note :</strong> {avis.note} / 5 <br />
          {avis.commentaire && <em>{avis.commentaire}</em>}
          <div className={styles.avisDate}>
            {new Date(avis.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}

      <hr className={styles.separator} />
      <h4 className={styles.formTitle}>Laisser un avis</h4>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.form}>
        <label className={styles.label}>
          Note (1-5) :
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                key={star}
                className={`${styles.star} ${star <= note ? styles.filled : ""}`}
                onClick={() => setNote(star)}
                >
                ★
                </span>
            ))}
          </div>
        </label>
        <label className={styles.label}>
          Commentaire :
          <textarea
            className={styles.textarea}
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
          />
        </label>
        <button onClick={handleSubmit} className={styles.button}>
          Envoyer
        </button>
      </div>
    </div>
  );
}