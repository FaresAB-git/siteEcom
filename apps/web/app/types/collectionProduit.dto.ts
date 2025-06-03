import { CollectionDto, CollectionResponseDto } from "./collection.dto";


export interface CollectionProduitDto {
  id: number;
  collectionId: number;
  produitId: number;
  collection: CollectionResponseDto;
}