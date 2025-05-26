'use client'
import { useEffect, useState } from "react";
import HorizontalNavBar from "../components/HorizontalNavBar";
//import { CommandeResponseDto } from "../types/commandResponse.dto";
import style from "../style/productAdmin.module.css"

type User = {
  id: number;
  email: string;
  role: string;
  commandes: CommandeResponseDto[];
};
// réecris pour avoir la liste des produits directement
type CommandeResponseDto = {
  id: number;
  adresse: string;
  codePostal: string | null;
  ville: string | null;
  pays: string | null;
  clientEmail: string | null;
  total: number;
  status: string;
  createdAt: string;
  produits: {
    quantite: number;
    prixUnitaire: number;
    produit: {
      id: number;
      nom: string;
    };
  }[];
};

export default function ClientAccount() {
  const [userInfo, setUserInfo] = useState<User | null>(null);

  useEffect(() => {
    const userString = localStorage.getItem("user");

    if (userString) {
      try {
        const parsedUser: User = JSON.parse(userString);
        setUserInfo(parsedUser);
        console.log(parsedUser);
      } catch (error) {
        console.error("Erreur lors du parsing du user :", error);
      }
    }
  }, []);

  function convertDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} à ${hours}:${minutes}`;
  }

  return (
    <>
      <HorizontalNavBar />
      <div>
        {userInfo ? (
          <>
            <h1>Bienvenue {userInfo.email}, voici votre liste de commandes :</h1>
            {userInfo.commandes.length > 0 ? (
              <table className={style.productTable}>
                <thead className={style.tableHead}>
                  <tr>
                    <th className={style.tableCell}>Commande ID</th>
                    <th className={style.tableCell}>Date</th>
                    <th className={style.tableCell}>Adresse livraison</th>
                    <th className={style.tableCell}>Mail</th>
                    <th className={style.tableCell}>Total</th>
                    <th className={style.tableCell}>Status</th>
                    <th className={style.tableCell}>Produits</th>
                  </tr>
                </thead>
                <tbody>
                  {userInfo.commandes.map((command) => (
                    <tr key={command.id} className={style.clickableRow}>
                      <td className={`${style.tableCell} ${style.rowBorder}`}>{command.id}</td>
                      <td className={`${style.tableCell} ${style.rowBorder}`}>{convertDate(command.createdAt)}</td>
                      <td className={`${style.tableCell} ${style.rowBorder}`}>{command.adresse}</td>
                      <td className={`${style.tableCell} ${style.rowBorder}`}>{command.clientEmail}</td>
                      <td className={`${style.tableCell} ${style.rowBorder}`}>{command.total} €</td>
                      <td className={`${style.tableCell} ${style.rowBorder}`}>{command.status}</td>
                      <td className={`${style.tableCell} ${style.rowBorder}`}>
                        {command.produits && command.produits.length > 0 ? (
                          <select>
                            {command.produits.map((cp, index) => (
                              <option key={index}>
                                {cp.produit.nom} - {cp.quantite}x ({cp.prixUnitaire} €)
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span>Aucun produit</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Aucune commande</p>
            )}
          </>
        ) : (
          <h1>Vous n'êtes pas connecté</h1>
        )}
      </div>
    </>
  );
}
