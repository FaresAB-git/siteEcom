import Image, { type ImageProps } from "next/image";
import React from "react";
import Link from 'next/link'
import style from "../../style/login.module.css"



export default function Home() {
  return (
    <> 
      <div className={style.loginContainer}>
        <h2 className={style.loginTitle}> Login </h2>
        <p> Connectez vous avec vos identifiant </p>

        <form className={style.loginForm}>

          <div className={style.inputContainer}>
            <label> EMAIL ADDRESS </label>
            <input></input>
            <label> PASSWORD </label>
            <input></input>
          </div>
          
          <button className={style.loginBtn}> login </button>
          <p className={style.registerP}> deja un compte ? <Link href="/admin/login" className={style.registerLink}>connectez vous ici</Link></p>
        </form>
      </div>
    </>
    
  );
}
