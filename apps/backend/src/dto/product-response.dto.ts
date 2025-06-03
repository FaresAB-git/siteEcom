// src/dto/product-response.dto.ts
import { CollectionProduit } from '@prisma/client';
import { Expose, Transform, Type } from 'class-transformer';

export class ProductResponseDto {
  @Expose()
  id: number;

  @Expose()
  nom: string;

  @Expose()
  description: string;

  @Expose()
  imgPath: string;

  @Expose()
  @Type(() => Number)
  @Transform(({ value }) => parseFloat(value.toString())) //permet de convertir un decimal en float car erreur "decimal" sinon
  prix: number;

  @Expose()
  stock: number;


  @Expose()
  createdAt: Date;

  @Expose()
  collections: CollectionProduit;
}
