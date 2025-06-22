'use client'

import { useEffect, useState } from "react";
import { getCollections } from "../services/collectionServices";
import { CollectionDto, CollectionResponseDto } from "../types/collection.dto";
import style from "../style/collectionCaroussel.module.css"
import { useRouter } from "next/navigation";

export default function CollectionCarousel(){

    const [collections, setCollections] = useState<CollectionResponseDto[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchCollections = async () => {
          const fetchedCollections = await getCollections();
          setCollections(fetchedCollections);
        };
        fetchCollections();
        
      }, []);
    return(
        <div className={style.container}>
            <h2 className={style.collectionTitle}> COLLECTIONS </h2>
            <div className={style.carousselContainer}>
                {collections.map((collection, index) => {
                    const transformedUrl = collection.imgPath?.replace(
                    '/upload/',
                    '/upload/w_900,h_600,c_fill,g_auto,f_auto,q_auto/'
                    );

                    return (
                    <div className={style.collectionContainer} key={index}>
                        <img src={transformedUrl} className={style.imgCollection} />
                        <span className={style.collectionLink} onClick={() => router.push('/collectionProducts/' + collection.id)}>  {collection.nom}</span>
                    </div>
                    );
                })}
            </div>
        </div>
    );
}