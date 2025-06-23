"use client";
import { useState } from "react";
import Link from "next/link";
import style from "../style/navBar.module.css";
import { FaBars } from "react-icons/fa";
import { IoMdPricetag } from "react-icons/io";
import { BsFillCollectionFill } from "react-icons/bs";
import { FaWarehouse } from "react-icons/fa6";
import { IoMdHome } from "react-icons/io";
import { TbTruckDelivery } from "react-icons/tb";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Bouton hamburger visible uniquement sur mobile */}
      <button className={style.hamburger} onClick={toggleNav}>
        <FaBars />
      </button>

      {/* Conteneur de la nav responsive */}
      <div className={`${style.container} ${isOpen ? style.open : ""}`}>
        <div className={style.linkContainer}>
          <Link href="/admin" className={style.navLink} onClick={() => setIsOpen(false)}>
            <div className={style.iconContainer}>
              <IoMdHome style={{ fontSize: "1.3rem" }} />
            </div>
            <span className={style.linkText}>Accueil</span>
          </Link>

          <Link href="/admin/product" className={style.navLink} onClick={() => setIsOpen(false)}>
            <div className={style.iconContainer}>
              <IoMdPricetag style={{ fontSize: "1.3rem" }} />
            </div>
            <span className={style.linkText}>Produits</span>
          </Link>

          <Link href="/admin/collection" className={style.navLink} onClick={() => setIsOpen(false)}>
            <div className={style.iconContainer}>
              <BsFillCollectionFill />
            </div>
            <span className={style.linkText}>Collection</span>
          </Link>

          <Link href="/admin/command" className={style.navLink} onClick={() => setIsOpen(false)}>
            <div className={style.iconContainer}>
              <TbTruckDelivery />
            </div>
            <span className={style.linkText}>Commande</span>
          </Link>

          <Link href="/admin/stock" className={style.navLink} onClick={() => setIsOpen(false)}>
            <div className={style.iconContainer}>
              <FaWarehouse />
            </div>
            <span className={style.linkText}>Stock</span>
          </Link>
        </div>
      </div>
    </>
  );
}

export default NavBar;
