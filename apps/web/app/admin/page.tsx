'use client';
import { useState } from "react";
import { createProduct } from "../services/productServices" // Importer la fonction de service
import { ProdDto } from "../types/product.dto"; // Assure-toi que ce chemin est correct
import Header from "../components/Header";
import NavBar from "../components/Navbar";
import VenteSemaineChart from "../components/VenteSemaineChart"
import style from "../style/homeAdmin.module.css"
import ChiffreAffaireChart from "../components/ChiffreAffaireChart";
import StockForecast from "../components/StockForecastBarchart";
import VenteParCollection from "../components/VenteParCollection";


export default function Home() {

  return (
    <>
      <Header/>
      <NavBar/>
      
      <div className={style.mainContent}> 
        <div className={style.container}> 
          <div className={style.chartContainer}>
            <VenteSemaineChart/>
            <ChiffreAffaireChart/>
            <StockForecast/>
            <VenteParCollection/>
          </div>
          
        </div>
        
      </div>
    </>
  );
}
