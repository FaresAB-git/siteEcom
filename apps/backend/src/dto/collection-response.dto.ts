// src/dto/collection-response.dto.ts
import { Expose } from 'class-transformer';

export class CollectionResponseDto {
  @Expose()
  id: number;

  @Expose()
  nom: string;

  @Expose()
  description: string | null;

  @Expose()
  createdAt: Date;
}
