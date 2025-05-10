import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { CommandeService } from './commande.service';
import { CreateCommandeDto } from 'src/dto/command.dto';
import { CreateCommandeWithProduitsDto } from 'src/dto/createComandWithProduct.dto';
import { CommandeResponseDto } from 'src/dto/commandResponse.dto';
import { ProductResponseDto } from 'src/dto/product-response.dto';



@Controller('commande')
export class CommandeController {
  constructor(private readonly commandeService: CommandeService) {}


  @Post()
  async create(@Body() createCommandeDto: CreateCommandeWithProduitsDto) {
    return this.commandeService.createCommande(createCommandeDto);
  }

  //recupere toutes les commandes (dans les produit pour l'instant)
  @Get()
  async getCommands() {
    return this.commandeService.getCommands();
  }

  //retourne tout les produits de c'une commande
  @Get("/produits/:commandId")
  async getProduitsFromCommand(@Param('commandId') id:string):Promise<ProductResponseDto[]>{
    const commandId = parseInt(id, 10);
    return this.commandeService.getProduitsByCommanId(commandId);
  }


}
