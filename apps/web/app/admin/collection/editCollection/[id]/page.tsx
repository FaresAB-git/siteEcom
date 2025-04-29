'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from "../../../../components/Header";
import NavBar from "../../../../components/Navbar";

import { ProductResponseDto } from '../../../../types/productResponse.dto';
import CollectionForm from '../../../../components/CollectionForm';

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();



  return (
    <>
      <Header />
      <NavBar />
      <CollectionForm mode='edit' collectionToEditId={Number(id)}/>
      
    </>
  );
}
