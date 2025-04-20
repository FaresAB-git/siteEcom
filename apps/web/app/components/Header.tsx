import style from "../style/header.module.css"



 function Header() {
  return(
    
    <>
        <div className={style.container}>
          <h1 className={style.adminTitle}> admin header</h1>
        </div>
    </>
  ); 

}
export default Header;