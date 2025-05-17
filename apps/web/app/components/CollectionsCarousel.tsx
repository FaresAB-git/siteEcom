'use client'

import { useEffect, useState } from "react";
import { getCollections } from "../services/collectionServices";
import { CollectionDto } from "../types/collection.dto";
import style from "../style/collectionCaroussel.module.css"

export default function CollectionCarousel(){

    const [collections, setCollections] = useState<CollectionDto[]>([]);

    useEffect(() => {
        const fetchCollections = async () => {
          const fetchedCollections = await getCollections();
          setCollections(fetchedCollections);
        };
        fetchCollections();
        
      }, []);
    return(
        <>
        <div className={style.carousselContainer}>
            {collections.map((collection, index) => (
                <div className={style.collectionContainer} key={index}>
                    <img src={collection.imgPath}  className={style.imgCollection}/>
                    <span> {collection.nom} </span>
                </div>
            ))}
        </div>
        </>
    );
}