import { Expose } from 'class-transformer';

export class AvisResponseDto {
  @Expose()
  id: number;

  @Expose()
  note: number;

  @Expose()
  commentaire?: string;

  @Expose()
  createdAt: Date;

  @Expose()
  userId?: number;
}
