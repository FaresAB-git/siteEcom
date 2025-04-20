import Link from "next/link";
import style from "../style/navBar.module.css"
import { FaBeer } from "react-icons/fa";
import { IoMdPricetag } from "react-icons/io";
import { BsFillCollectionFill } from "react-icons/bs";
import { FaWarehouse } from "react-icons/fa6";

 function NavBar() {
  return(  
    <>
        <div className={style.container}>
            <div className={style.linkContainer}> 
                <Link href="" className={style.navLink}>
                  <div className={style.iconContainer}>
                    <IoMdPricetag />
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