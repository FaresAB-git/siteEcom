'use client';
import { useState, useEffect } from "react";
import Image from "next/image";
import { getProducts } from "../services/productServices";
import style from "../style/productGallery.module.css";
import { ProductResponseDto } from "../types/productResponse.dto";
import { useRouter } from "next/navigation";
import { CollectionResponseDto } from "../types/collection.dto";
import { getCollections } from "../services/collectionServices";

interface ProductGalleryProps {
    filter?: boolean;
}

export default function ProductGallery({ filter = false }: ProductGalleryProps) {
    const router = useRouter();
    const [products, setProducts] = useState<ProductResponseDto[]>([]);
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
    const [collections, setCollections] = useState<CollectionResponseDto[]>([]);
    const [selectedCollections, setSelectedCollections] = useState<number[]>([]);

    const handleCollectionToggle = (collectionId: number) => {
        setSelectedCollections((prev) => {
            if (prev.includes(collectionId)) {
                const updated = prev.filter(id => id !== collectionId);
                return updated;
            } else {
                const updated = [...prev, collectionId];
                return updated;
            }
        });
    };

  

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const products = await getProducts();
                console.log("produit:");
                console.log(products);
                setProducts(products);

                const collections = await getCollections();
                setCollections(collections);
            } catch (error) {
                console.log('Erreur lors de la récupération des produits');
            }
        };
        fetchProduct();

    }, []);

    // Recherche
    
    const filteredAndSortedProducts = products
    .filter(product => {
        const matchesSearch = product.nom.toLowerCase().includes(search.toLowerCase());
        const matchesCollection =
    selectedCollections.length === 0 ||
    product.collections.some((c) => selectedCollections.includes(c.collection.id));
        console.log("selected coll: " + selectedCollections);
        return matchesSearch && matchesCollection;
    })
    .sort((a, b) => {
        if (sortOrder === "asc") return a.prix - b.prix;
        if (sortOrder === "desc") return b.prix - a.prix;
        return 0;
    });


    return (
        <div className={style.container}>
            <h2 className={style.productGalleryTitle}>TOUT LES PRODUITS</h2>

            {filter && (
                <div className={style.filterBar}>
                    
                    <input
                        type="text"
                        placeholder="Rechercher un produit..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={style.searchInput}
                    />
                    <button
                        onClick={() => setSortOrder("asc")}
                        className={style.sortButton}
                    >
                        Prix croissant
                    </button>
                    <button
                        onClick={() => setSortOrder("desc")}
                        className={style.sortButton}
                    >
                        Prix décroissant
                    </button>
                    <p> Par collection </p>
                    {collections.map((collections) => (
                        <div key={collections.id} className={style.collectionSortElemet}> 
                            <input type="checkbox"
                            className={style.checkbox}
                            checked={selectedCollections.includes(collections.id)}
                            onChange={() => handleCollectionToggle(collections.id)}/>

                            <label className={style.collectionLabel}> {collections.nom} </label> 
                        </div>
                    )) }
                    
                </div>
            )}

            <div className={style.galleryContainer}>
                {(filter ? filteredAndSortedProducts : products).map((product, index) => (
                    <div
                        key={index}
                        className={style.productCard}
                        onClick={() => router.push("/productPage/" + product.id)}
                    >
                        <div className={style.imageWrapper}>
                            <Image
                                src={product.imgPath || "/placeholder.png"}
                                alt={product.nom}
                                fill
                                className={style.productImage}
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
