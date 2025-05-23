'use client';
import { useState, useEffect } from "react";
import Image from "next/image";
import { getProducts } from "../services/productServices";
import style from "../style/productGallery.module.css";
import { ProductResponseDto } from "../types/productResponse.dto";
import { useRouter } from "next/navigation";

interface ProductGalleryProps {
    filter?: boolean;
}

export default function ProductGallery({ filter = false }: ProductGalleryProps) {
    const router = useRouter();
    const [products, setProducts] = useState<ProductResponseDto[]>([]);
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const products = await getProducts();
                setProducts(products);
            } catch (error) {
                console.log('Erreur lors de la récupération des produits');
            }
        };
        fetchProduct();
    }, []);

    // Recherche
    const filteredProducts = products.filter(product =>
        product.nom.toLowerCase().includes(search.toLowerCase())
    );

    // Tri par prix
    const sortedProducts = [...filteredProducts].sort((a, b) => {
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
                </div>
            )}

            <div className={style.galleryContainer}>
                {(filter ? sortedProducts : products).map((product, index) => (
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
