import Link from "next/link";
import style from "../style/navBar.module.css"
import { FaBeer } from "react-icons/fa";
import { IoMdPricetag } from "react-icons/io";
import { BsFillCollectionFill } from "react-icons/bs";
import { FaWarehouse } from "react-icons/fa6";
import { IoMdHome } from "react-icons/io";

 function NavBar() {
  return(  
    <>
        <div className={style.container}>
            <div className={style.linkContainer}> 
                <Link href="/admin/product" className={style.navLink}>
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

                <Link href="" className={style.navLink}>
                  <div className={style.iconContainer}>
                    <BsFillCollectionFill />
                  </div> 
                  <span className={style.linkText}> Collection </span> 
                </Link>

                <Link href="" className={style.navLink}>
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