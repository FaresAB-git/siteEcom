'use client';
import { useState } from "react";
import { createProduct } from "../../services/productServices" // Importer la fonction de service
import { ProdDto } from "../../types/product.dto"; // Assure-toi que ce chemin est correct
import Header from "../../components/Header";
import NavBar from "../../components/Navbar";

export default function Home() {

  return (
    <>
      <Header/>
      <NavBar/>
      
      
    </>
  );
}
