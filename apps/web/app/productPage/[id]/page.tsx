'use client'
import Image, { type ImageProps } from "next/image";
import HorizontalNavBar from "../../components/HorizontalNavBar";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';


export default function ProductPage() {
const { id } = useParams();
console.log(id);
  return (
    <>
      <HorizontalNavBar/>
      <h1> page produit </h1>

    </>
  );
}
