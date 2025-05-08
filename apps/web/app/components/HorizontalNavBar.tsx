'use client';
import Link from "next/link";
import styles from "../style/HorizontalNavBar.module.css";
import Cart from "./Cart";
import { useEffect, useState } from "react";
import { CollectionDto, CollectionResponseDto } from "../types/collection.dto";
import { getCollections } from "../services/collectionServices";
import { useRouter } from "next/navigation";

export default function HorizontalNavBar() {
  const [collections, setCollections] = useState<CollectionResponseDto[]>([]);
  const [hoveredCollection, setHoveredCollection] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCollections = async () => {
      const fetchedCollections = await getCollections();
      setCollections(fetchedCollections);
    };
    fetchCollections();
    
  }, []);
  console.log(collections);
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">MonLogo</Link>
      </div>

      <nav className={styles.nav}>
        <Link href="/">Accueil</Link>
        <Link href="/catalogue">Catalogue</Link>

        <div
          className={styles.collectionsContainer}
          onMouseLeave={() => setHoveredCollection(null)}
        >
          <Link href="/collections">Collections</Link>
          <div className={styles.dropdown}>
            {collections.map((collection, index) => (
              <div
              key={index}
              onMouseEnter={() => setHoveredCollection(collection.nom)}
              className={styles.collectionItem}
              onClick={() => router.push(`/collectionProducts/${collection.id}`)}
            >
              {collection.nom}
            </div>
            
            ))}
          </div>
        </div>
      </nav>
     

      <Cart />
    </header>
  );
}
