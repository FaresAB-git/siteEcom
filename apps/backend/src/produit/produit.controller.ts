import { Controller, Post, Req, Body, UseGuards } from "@nestjs/common";
import { ProduitService } from './produit.service';
import { ProdDto } from "src/dto/product.dto";
import { AuthGuard } from '@nestjs/passport';

@Controller('produit')
export class ProduitController {
  constructor(private readonly produitService: ProduitService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post("")
  createProduct(@Body() prod: ProdDto){
    console.log("création produit");
    console.log({prod});
    const produit = this.produitService.createProduct(prod);
    return produit;
  }

}
