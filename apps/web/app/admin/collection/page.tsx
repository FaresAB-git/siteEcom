'use client'
import Header from "../../components/Header";
import NavBar from "../../components/Navbar";
import { getCollections } from "../../services/collectionServices";
import style from "../../style/collectionAdmin.module.css"
import { useEffect, useState } from "react";
import { CollectionResponseDto } from "../../types/collection.dto";
import Link from "next/link";
import { useRouter } from "next/navigation";


function Collection() {
  const router = useRouter();
  const [collections, setCollections] = useState<CollectionResponseDto[]>([]);
  const [error, setError] = useState<string | null>(null) ;

  useEffect(() =>{
      const fetchProducts = async () => {
        try {
          const data: any = await getCollections();
          setCollections(data);
        } catch (err:any) {
          setError(err.message);
        }
      };
      fetchProducts();
      
    }, [])
  return (
    <>
      <Header/>
      <NavBar/>
      
      <div className={style.mainContent}>
        <div className={style.container}>
        <div className={style.btnContainer}> <Link href="/admin/collection/createCollection" className={style.addProductBtn}> Creer une collection </Link> </div>
        <div className={style.productTableContainer}> 
          <table className={style.productTable}>
            <thead className={style.tableHead}>
              <tr className={style.row}>
                <th className={style.tableCell}>Nom</th>
                <th className={style.tableCell}>Description</th>
          
              </tr>
            </thead>
            <tbody>
              {collections.map((collection: CollectionResponseDto) => (
                <tr key={collection.id} className={style.row}
                onClick={() => router.push(`/admin/collection/editCollection/${collection.id}`)}
                >
                  <th> {collection.nom} </th>
                  <th> {collection.description} </th>
                </tr>
              ))}
            </tbody>

          </table>
          </div>
        </div>
      </div>
    </>
  ); 
}
export default Collection;
