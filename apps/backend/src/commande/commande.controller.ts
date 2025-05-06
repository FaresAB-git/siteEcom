import { Body, Controller, Post } from '@nestjs/common';
import { CommandeService } from './commande.service';
import { CreateCommandeDto } from 'src/dto/command.dto';
import { CreateCommandeWithProduitsDto } from 'src/dto/createComandWithProduct.dto';



@Controller('commande')
export class CommandeController {
  constructor(private readonly commandeService: CommandeService) {}


  @Post()
  async create(@Body() createCommandeDto: CreateCommandeWithProduitsDto) {
    return this.commandeService.createCommande(createCommandeDto);
  }
}
