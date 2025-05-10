// src/dto/response-commande.dto.ts
import { Type, Exclude, Expose, Transform } from 'class-transformer';
import { Decimal } from '@prisma/client/runtime/library';
import { CommandeProduit } from '@prisma/client';

@Expose()
export class CommandeResponseDto {
  @Expose()
  id: number;

  @Expose()
  userId?: number;

  @Expose()
  clientEmail?: string;

  @Expose()
  adresse: string;

  @Expose()
  codePostal?: string;

  @Expose()
  ville?: string;

  @Expose()
  pays?: string;

  @Expose()
  @Type(() => Number)
  @Transform(({ value }) => value ? parseFloat(value.toString()) : 0) // Si value est null ou undefined, on met 0 par défaut
  total: number;

  @Expose()
  status: string;

  @Expose()
  @Type(() => Date)
  createdAt: Date;

  @Expose()
  produits: CommandeProduit[];
}
