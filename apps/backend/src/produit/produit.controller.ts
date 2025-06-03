import { Controller, Post, Req, Body, UseGuards, Get, Param, Delete, Put } from "@nestjs/common";
import { ProduitService } from './produit.service';
import { ProdDto } from "src/dto/product.dto";
import { AuthGuard } from '@nestjs/passport';
import { ProductResponseDto } from "src/dto/product-response.dto";

@Controller('produit')
export class ProduitController {
  constructor(private readonly produitService: ProduitService) {}

  @Get('/newProducts')
  async getNouveaute(): Promise<ProductResponseDto[]> {
    return this.produitService.getNewProduct();
  }

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

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async updateProduct(@Param('id') productId: string,@Body() prod: ProdDto) {
    const id = parseInt(productId, 10);
    console.log("mise à jour produit", id);
    const updated = await this.produitService.updateProduct(id, prod);
    return updated;
  }

  
}
