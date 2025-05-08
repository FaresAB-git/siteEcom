import { CreateCommandeDto } from "./createCommand.dto";
import { CommandProduitDto } from "./createCommandProduit.dto";


export interface CreateCommandeWithProduitsDto {
    commande: CreateCommandeDto;
    produits: CommandProduitDto[];
  }
  