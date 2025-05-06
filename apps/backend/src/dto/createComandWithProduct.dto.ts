// dto/create-commande-with-produits.dto.ts
import { Type } from 'class-transformer';
import { ValidateNested, IsArray } from 'class-validator';
import { CreateCommandeDto } from './command.dto';
import { CommandProduitDto } from './commandProduit.dto';


export class CreateCommandeWithProduitsDto {
  @ValidateNested()
  @Type(() => CreateCommandeDto)
  commande: CreateCommandeDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CommandProduitDto)
  produits: CommandProduitDto[];
}