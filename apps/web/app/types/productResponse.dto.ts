import { AvisResponse } from "./AvisResponse";
import { CollectionProduitDto } from "./collectionProduit.dto";


export interface ProductResponseDto {
  id: number;
  nom: string;
  description?: string;
  imgPath: string;
  prix: number;
  stock: number;
  collections: CollectionProduitDto[];
  avis: AvisResponse[];
}
