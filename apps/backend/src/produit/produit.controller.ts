import { Controller, Post, Req, Body, UseGuards, Get, Param, Delete } from "@nestjs/common";
import { ProduitService } from './produit.service';
import { ProdDto } from "src/dto/product.dto";
import { AuthGuard } from '@nestjs/passport';
import { ProductResponseDto } from "src/dto/product-response.dto";

@Controller('produit')
export class ProduitController {
  constructor(private readonly produitService: ProduitService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post("")
  async createProduct(@Body() prod: ProdDto) {
    console.log("création produit");
    console.log({prod});
    const produit = await this.produitService.createProduct(prod);
    return produit;
  }

  @Get("")
  async getProducts():Promise<ProductResponseDto[]>{
     const products:ProductResponseDto[] = await this.produitService.getProducts();
     console.log(products);
     return products;
  }

  @Get(":id")
  async getProduct(@Param('id') productId: string):Promise<ProductResponseDto> {
    const id = parseInt(productId, 10); // Convertir le paramètre en nombre
    const produit: ProductResponseDto = await this.produitService.getProduct(id);
    return produit;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(":id")
  async delProduct(@Param('id') productId: string){
    const id = parseInt(productId, 10); // Convertir le paramètre en nombre
    const produit: ProductResponseDto = await this.produitService.delProduct(id);
    return produit;
  }

}
