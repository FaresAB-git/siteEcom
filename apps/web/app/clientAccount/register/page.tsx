"use client";
import React, { useState } from "react";
import Link from "next/link";
import style from "../../style/login.module.css";
import { useRouter } from 'next/navigation';
import { login, register } from "../../services/userServices";
import HorizontalNavBar from "../../components/HorizontalNavBar";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null); // Ajout d'un état pour l'erreur
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); 
    try {
      console.log(email, password);
      const token = await register(email, password);
      console.log(token);
      localStorage.setItem("token", token.access_token);
      localStorage.setItem("user", JSON.stringify(token.user));
      console.log("Connexion réussie !");
      router.push("/clientAccount");

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
      <HorizontalNavBar/>
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
          <p className={style.registerP}>
            déja un compte ?{" "}
            <Link href="/clientAccount/login" className={style.registerLink}>
              connecté vous ici
            </Link>{" "}
            
          </p>
        </form>
      </div>
    </>
  );
}
