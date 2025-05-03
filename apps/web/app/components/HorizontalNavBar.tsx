import Link from "next/link";
import styles from "../style/HorizontalNavBar.module.css";

export default function HorizontalNavBar() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">MonLogo</Link>
      </div>
      <nav className={styles.nav}>
        <Link href="/">Accueil</Link>
        <Link href="/catalogue">Catalogue</Link>
        <Link href="/collections">Collections</Link>
      </nav>
    </header>
  );
}
