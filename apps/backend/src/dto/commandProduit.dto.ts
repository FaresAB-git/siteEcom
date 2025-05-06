import { IsNumber, Min } from 'class-validator';

export class CommandProduitDto {
  
  //@IsNumber()
  //commandeId: number;  //pas besoin de le fournir, l'id sera mit automatiquement 

  @IsNumber()
  produitId: number;

  @IsNumber()
  quantite: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  prixUnitaire: number;

}
