import { IsInt, IsOptional, IsString, Max, Min, IsNotEmpty } from 'class-validator';

export class CreateAvisDto {
  @IsInt()
  @Min(1)
  produitId: number;

  @IsOptional()
  @IsInt()
  userId?: number;

  @IsInt()
  @Min(1)
  @Max(5)
  note: number;

  @IsOptional()
  @IsString()
  commentaire?: string;
}
