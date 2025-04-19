"use client";
import React, { useState } from "react";
import Link from "next/link";
import style from "../../style/login.module.css";
import { loginAdmin } from "../../services/userServices";
import { useRouter } from 'next/navigation';


export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null); // Ajout d'un état pour l'erreur
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); 
    try {
      console.log(email, password);
      const token = await loginAdmin(email, password); 
      console.log(token);
      console.log("Connexion réussie !");
      

    } catch (error: unknown) {
      console.error("Erreur de connexion :", error);
      
      if (error instanceof Error) {
        setError(error.message); 
      } else {
        setError("Une erreur inconnue s'est produite.");
      }
    }
  };

  return (
    <>
      <div className={style.loginContainer}>
        <h2 className={style.loginTitle}>Login</h2>
        <p>Connectez-vous avec vos identifiants</p>

        <form className={style.loginForm} onSubmit={handleSubmit}>
          <div className={style.inputContainer}>
            <label>EMAIL ADDRESS</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            {error && <p className={style.errorMessage}>{error}</p>}
          </div>

          <button className={style.loginBtn} type="submit">
            Login
          </button>
          {/*<p className={style.registerP}>
            Pas encore de compte ?{" "}
            <Link href="/admin/register" className={style.registerLink}>
              Créez-en
            </Link>{" "}
            un gratuitement.
          </p>*/}
        </form>
      </div>
    </>
  );
}
