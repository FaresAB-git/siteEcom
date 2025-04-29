'use client';
import { useState, useEffect } from "react";
import style from "../style/createCollection.module.css";
import { CollectionResponseDto } from "../types/collection.dto";
import { addProductsToCollection, createCollection, getCollection, getCollections, getProductsFromCollection, updateCollection, updateProducts } from "../services/collectionServices";
import { ProductResponseDto } from "../types/productResponse.dto";
import { getProducts, updateProduct } from "../services/productServices";
import { useRouter } from "next/navigation";

type CollectionFormProps = {
  mode: 'create' | 'edit';
  collectionToEditId?: number;
};

export default function CollectionForm({ mode, collectionToEditId }: CollectionFormProps) {

  const router = useRouter();
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [allProducts, setAllProducts] = useState<ProductResponseDto[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [checkedProductIds, setCheckedProductIds] = useState<number[]>([]); // Liste des IDs sélectionnés dans le modal

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setCheckedProductIds(selectedProductIds); // Lors de l'ouverture du modal, restaurer l'état des produits sélectionnés
    setIsModalOpen((prev) => !prev);
  };

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const products: ProductResponseDto[] = await getProducts();
        console.log(products);
        setAllProducts(products);
      } catch (error) {
        console.log("erreur lors de la récupération des collections");
      }

      if(mode == 'edit' && collectionToEditId){
        try {
          //TO-DO faire la route backend pour recup les info d'une collection et mettree le titre et la description
          const collection = await getCollection(collectionToEditId);
          setDescription(collection.description);
          setTitre(collection.nom);
          //const collectionInfo = await getCo
          const productsFromCollection  = await getProductsFromCollection(collectionToEditId)
          // Extraire les IDs des produits récupérés
          const productIds = productsFromCollection.map((product: ProductResponseDto) => product.id);

          // Mettre à jour les deux listes avec les IDs extraits
          setSelectedProductIds(productIds);
          setCheckedProductIds(productIds);
        } catch (error) {
          console.log("erreur lors de la recuperation des produit de la collection:", error);
        }
      }
    };
    fetchCollection();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Formulaire soumis avec les produits sélectionnés:", selectedProductIds);

    
    try {
      if(mode == 'create'){
        const collection = await createCollection({nom: titre, description});
        console.log(collection);
        await addProductsToCollection(collection.id, selectedProductIds);
      }
      else if(mode == 'edit' && collectionToEditId){
        const collection = await updateCollection(collectionToEditId, {nom: titre, description});
        await updateProducts(collectionToEditId, selectedProductIds); 
        console.log('collection modifier');
      }
     
    } catch (error) {
      console.log("error lors de la creation ou modif de la collection:", error);
    }
    router.push("/admin/collection");
  };

  // Permet de conserver l'état des cases cochées même lorsque l'on ferme le modal
  const handleProductCheck = (productId: number) => {
    setCheckedProductIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleConfirmSelection = () => {
    setSelectedProductIds(checkedProductIds);  // Met à jour la sélection confirmée
    setCheckedProductIds([]);  // Réinitialise checkedProductIds pour la prochaine ouverture
    toggleModal();  // Ferme le modal après la confirmation
  };

  return (
    <div className={style.mainContent}>
      <div className={style.container}>
        <form className={style.productForm} onSubmit={handleSubmit}>
          <label>Titre</label>
          <input type="text" className={style.input} value={titre} onChange={(e) => setTitre(e.target.value)} />
          <label>Description</label>
          <textarea rows={6} className={style.descInput} value={description} onChange={(e) => setDescription(e.target.value)} />

          <button type="button" className={style.openModalButton} onClick={toggleModal}>
            Sélectionner les produits
          </button>

          {isModalOpen && (
            <div className={style.overlay} onClick={toggleModal}>
              <div className={style.modalContent} onClick={(e) => e.stopPropagation()}>
                <h3>Sélectionner les produits</h3>
                <button className={style.closeButton} onClick={toggleModal}>X</button>
                <div className={style.productList}>
                  {allProducts.map((product) => (
                    <div key={product.id} className={style.productItem}>
                      <input
                        type="checkbox"
                        id={`product-${product.id}`}
                        onChange={() => handleProductCheck(product.id)} // Met à jour l'état local des cases
                        checked={checkedProductIds.includes(product.id)} // Utilise checkedProductIds pour les cases actives
                      />
                      <div className={style.imgContainer}> 
                        <img className={style.img} src={product.imgPath}/>
                      </div>
                      <label htmlFor={`product-${product.id}`}>{product.nom}</label>
                    </div>
                  ))}
                </div>
                <button type="button" className={style.submitModalButton} onClick={handleConfirmSelection}>
                  Confirmer la sélection
                </button>
              </div>
            </div>
          )}

          <button type="submit" className={style.submitButton}>
            {mode === 'edit' ? 'Modifier la collection' : 'Créer la collection'}
          </button>
        </form>
      </div>
    </div>
  );
}
