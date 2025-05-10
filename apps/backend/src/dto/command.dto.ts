import { IsEmail, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateCommandeDto {
  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsString()
  adresse: string;

  @IsOptional()
  @IsEmail()
  clientEmail?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  total: number;

  @IsOptional()
  @IsString()
  status?: string; // "en attente" par défaut
}
