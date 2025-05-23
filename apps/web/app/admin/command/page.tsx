'use client'
import { useState, useEffect } from "react";
import { CommandeResponseDto } from "../../types/commandResponse.dto";
import { getCommands } from "../../services/commandServices";
import Header from "../../components/Header";
import NavBar from "../../components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import style from "../../style/commandAdmin.module.css"

export default function Commands(){
    const router = useRouter();
    const [commands, setCommands] = useState<CommandeResponseDto[]>([])

    
    // Fonction pour formater une date en "JJ/MM/AAAA à HH:MM"
    function convertDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mois commence à 0
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} à ${hours}:${minutes}`;
}

    useEffect(() => {
        const fetchComands = async () =>{
            const commands = await getCommands();
            console.log(commands);
            setCommands(commands);
        }
        fetchComands();
    },[]); 

    return(
        <>
      <Header/>
      <NavBar/>
      <h2 className={style.pageTitle}>Commandes</h2>
      <div className={style.mainContent}> 
        <div className={style.container}> 
          
          <div className={style.productTableContainer}> 
          <table className={style.productTable}>
            <thead className={style.tableHead}>
              <tr>
                <th className={style.tableCell}>commande ID</th>
                <th className={style.tableCell}>Date</th>
                <th className={style.tableCell}>Adresse livraison</th>
                <th className={style.tableCell}>Mail</th>
                <th className={style.tableCell}>Total</th>
                <th className={style.tableCell}>Status</th>
              </tr>
            </thead>
            <tbody>
              {commands.map((command) => (
                <tr
                  key={command.id}
                  className={style.clickableRow}
                  onClick={() => router.push("/admin/command/" + command.id)}
                >
                  <td className={`${style.tableCell} ${style.rowBorder}`}>{command.id}</td>
                  <td className={`${style.tableCell} ${style.rowBorder}`}>{convertDate(command.createdAt)} </td>
                  <td className={`${style.tableCell} ${style.rowBorder}`}>{command.adresse}</td>
                  <td className={`${style.tableCell} ${style.rowBorder}`}>{command.clientEmail}</td>
                  <td className={`${style.tableCell} ${style.rowBorder}`}>{command.total} €</td>
                  <td className={`${style.tableCell} ${style.rowBorder}`}>{command.status}</td>
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