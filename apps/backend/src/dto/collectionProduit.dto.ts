// collection-produit.dto.ts
import { Expose, Type } from 'class-transformer';
import { CollectionDto } from './collection.dto';

export class CollectionProduitDto {
  @Expose()
  id: number;

  @Expose()
  collectionId: number;

  @Expose()
  produitId: number;

  @Expose()
  collection: CollectionDto;
}