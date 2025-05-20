import Link from "next/link";
import style from "../style/navBar.module.css"
import { FaBeer } from "react-icons/fa";
import { IoMdPricetag } from "react-icons/io";
import { BsFillCollectionFill } from "react-icons/bs";
import { FaWarehouse } from "react-icons/fa6";
import { IoMdHome } from "react-icons/io";
import { TbTruckDelivery } from "react-icons/tb";

 function NavBar() {
  return(  
    <>
        <div className={style.container}>
            <div className={style.linkContainer}> 
                <Link href="/admin" className={style.navLink}>
                  <div className={style.iconContainer}>
                    <IoMdHome style={{ fontSize: "1.3rem" }}/>
                  </div> 
                  <span className={style.linkText}> Acceuil </span> 
                </Link>
                <Link href="/admin/product" className={style.navLink}>
                  <div className={style.iconContainer}>
                    <IoMdPricetag style={{ fontSize: "1.3rem" }}/>
                  </div> 
                  <span className={style.linkText}> Produits </span> 
                </Link>

                <Link href="/admin/collection" className={style.navLink}>
                  <div className={style.iconContainer}>
                    <BsFillCollectionFill />
                  </div> 
                  <span className={style.linkText}> Collection </span> 
                </Link>

                <Link href="/admin/command" className={style.navLink}>
                  <div className={style.iconContainer}>
                    <TbTruckDelivery />
                  </div> 
                  <span className={style.linkText}> Commande </span> 
                </Link>

                <Link href="/admin/stock" className={style.navLink}>
                  <div className={style.iconContainer}>
                    <FaWarehouse />
                  </div> 
                  <span className={style.linkText}> Stock </span> 
                </Link>
            </div>
        </div>
    </>
  ); 

}
export default NavBar;