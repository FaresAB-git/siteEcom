import { Body, Controller, Post, Param, Get, UseGuards, Delete } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CollectionDto } from 'src/dto/collection.dto';
import { CollectionResponseDto } from 'src/dto/collection-response.dto';
import { ProductResponseDto } from 'src/dto/product-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { CollectionProduit } from '@prisma/client';

@Controller('collections')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}
  @UseGuards(AuthGuard('jwt'))
  @Post('')
  async createCollection(@Body() collection: CollectionDto): Promise<CollectionResponseDto>{
    return this.collectionService.createCollection(collection);
  }

  //TODO: le type de retour (dto)
  //ajouter un produit dans une collection
  @UseGuards(AuthGuard('jwt'))
  @Post(':collectionId/produit/:productId')
  async addProductToCollection(@Param('collectionId') collectionId: string, @Param('productId') productId: string ):Promise<CollectionProduit>{
    const collectId = parseInt(collectionId, 10); // Convertir le paramètre en nombre
    const prodId = parseInt(productId, 10); // Convertir le paramètre en nombre
    return this.collectionService.addProductToCollection(collectId, prodId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':collectionId/produit/:productId')
  async removeProductFromCollection(@Param('collectionId') collectionId: string, @Param('productId') productId: string ){
    const collectId = parseInt(collectionId, 10); // Convertir le paramètre en nombre
    const prodId = parseInt(productId, 10); // Convertir le paramètre en nombre
    this.collectionService.removeProductFromCollection(collectId, prodId);
    return "Produit supprimer";
  }

  //recupere tout les produit d'une collection
  @Get(':collectionId/produits')
  async getProductsFromCollection(@Param('collectionId') collectionId: string):Promise<ProductResponseDto[]>{
    const collectId = parseInt(collectionId, 10); // Convertir le paramètre en nombre
    const produits = this.collectionService.getProductsFromCollection(collectId);
    return produits;
  }
}
