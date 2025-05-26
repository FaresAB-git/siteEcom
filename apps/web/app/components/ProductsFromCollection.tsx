'use client';
import { useState, useEffect } from "react";
import Image from "next/image";
import { getProducts } from "../services/productServices";
import style from "../style/productsFromCollection.module.css";
import { ProductResponseDto } from "../types/productResponse.dto";
import { useRouter } from "next/navigation";
import { getCollection, getProductsFromCollection } from "../services/collectionServices";
import { CollectionResponseDto } from "../types/collection.dto";

export default function ProductGallery({ collectionId }: { collectionId: number }) {
    const router = useRouter()
    const [products, setProducts] = useState<ProductResponseDto[]>([]);
    const [collection, setCollection] = useState<CollectionResponseDto>();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const products = await getProductsFromCollection(collectionId);
                setProducts(products);
                const collection = await getCollection(collectionId);
                setCollection(collection);
            } catch (error) {
                console.log('Erreur lors de la récupération des produits');
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className={style.container}>
            <h2 className={style.productGalleryTitle}>{collection?.nom} </h2>
            <div className={style.galleryContainer}>
                {products.map((product, index) => (
                    <div key={index} className={style.productCard} onClick={ () => {router.push("/productPage/" + product.id)}}>
                        <div className={style.imageWrapper}>
                        <Image
                            src={product.imgPath || "/placeholder.png"}
                            alt={product.nom}
                            fill
                            className={style.productImage}
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />

                        </div>
                        <h3 className={style.productName}>{product.nom}</h3>
                        <p className={style.productPrice}>{product.prix} €</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
