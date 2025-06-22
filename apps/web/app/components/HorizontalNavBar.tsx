'use client';
import Link from "next/link";
import styles from "../style/HorizontalNavBar.module.css";
import Cart from "./Cart";
import { useEffect, useState } from "react";
import { CollectionResponseDto } from "../types/collection.dto";
import { getCollections } from "../services/collectionServices";
import { useRouter } from "next/navigation";
import { MdAccountCircle } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";

export default function HorizontalNavBar() {
  const [collections, setCollections] = useState<CollectionResponseDto[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [menuOff, setMenuOff] = useState(false);
  const [mobileCollectionsVisible, setMobileCollectionsVisible] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchCollections = async () => {
      const fetchedCollections = await getCollections();
      setCollections(fetchedCollections);
    };
    fetchCollections();
  }, []);

  const handleToggle = () => {
    setMenuOff(!menuOff);
    setMobileCollectionsVisible(false); // reset on close
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <div className={styles.offCanvaIcon} onClick={handleToggle}> 
          <GiHamburgerMenu size={24} />
        </div>
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

      {menuOff && (
        <div className={styles.offMenu}>
          <Link href="/" onClick={handleToggle}>Accueil</Link>
          <Link href="/catalogue" onClick={handleToggle}>Catalogue</Link>
          <div
            className={styles.mobileCollectionToggle}
            onClick={() => setMobileCollectionsVisible(!mobileCollectionsVisible)}
          >
            Collections ▾
          </div>
          {mobileCollectionsVisible && (
            <div className={styles.mobileSubMenu}>
              {collections.map((collection) => (
                <Link
                  key={collection.id}
                  href={"/collectionProducts/" + collection.id}
                  className={styles.collectionLink}
                  onClick={handleToggle}
                >
                  {collection.nom}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      <div className={styles.cartContainer}>
        <Cart />
        <div className={styles.accountIconContainer}>
          <MdAccountCircle size={27} onClick={() => { router.push("/clientAccount") }} />
        </div>
      </div>
    </header>
  );
}
