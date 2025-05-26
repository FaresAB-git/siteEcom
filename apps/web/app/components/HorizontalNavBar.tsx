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
  const [showDropdown, setShowDropdown] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchCollections = async () => {
      const fetchedCollections = await getCollections();
      setCollections(fetchedCollections);
    };
    fetchCollections();
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">E-PERIF</Link>
      </div>

      <nav className={styles.nav}>
        <Link href="/">Accueil</Link>
        <Link href="/catalogue">Catalogue</Link>
        <Link href="/collections" onMouseEnter={() => setShowDropdown(true)}>Collections</Link>
      </nav>
      {showDropdown && (
            <div className={styles.dropdown} onMouseLeave={() => setShowDropdown(false)}>
              {collections.map((collection) => (
                <Link
                  key={collection.id}
                  href={"/collectionProducts/" + collection.id}
                  className={styles.collectionLink}
                >
                  {collection.nom}
                </Link>
              ))}
            </div>
          )}

      <div className={styles.cartContainer}>
        <Cart />
      </div>
    </header>
  );
}
