import { Injectable } from '@nestjs/common';
import { CollectionDto } from 'src/dto/collection.dto';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CollectionResponseDto } from 'src/dto/collection-response.dto';
import { plainToInstance } from 'class-transformer';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { InternalServerErrorException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { ProductResponseDto } from 'src/dto/product-response.dto';


@Injectable()
export class CollectionService {
  constructor(private prisma: PrismaService) {}

  async createCollection(collection: CollectionDto,): Promise<CollectionResponseDto> {
    try {
      const collect = await this.prisma.collection.create({
        data: {
          nom: collection.nom,
          description: collection.description,
        },
      });
      return plainToInstance(CollectionResponseDto, collect, {excludeExtraneousValues: true,});
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw error;
      }
      throw new InternalServerErrorException('Erreur lors de la création de la collection');
    }
  }

  async addProductToCollection(collectionId: number, productId: number){
    try {
      const product = await this.prisma.produit.findUnique({
        where: {id: productId}
      });
      if(!product){
        throw new NotFoundException(`Produit avec l'ID ${productId} introuvable`);
      }

      const collection = await this.prisma.collection.findUnique({
        where: {id: collectionId}
      });
      if (!collection) {
        throw new NotFoundException(`Collection avec l'ID ${collectionId} introuvable`);
      }

      const association = await this.prisma.collectionProduit.create({
        data: {
          collectionId,
          produitId: productId,
        },
      });
      return association;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw error;
      }
      throw new InternalServerErrorException('Erreur lors de la création de la collection');
    }
  }

  async getProductsFromCollection(collectionId: number): Promise<ProductResponseDto[]>{
    try {
      const collection = await this.prisma.collection.findUnique({
        where: { id: collectionId },
        include: {
          produits: {
            include: {
              produit: true
            }
          }
        }
      });
      if (!collection) {
        throw new NotFoundException(`Collection avec l'ID ${collectionId} introuvable`);
      }
      console.log(collection);
      const produits = collection.produits.map((cp) => cp.produit);
      console.log(produits);

      return plainToInstance(ProductResponseDto, produits, { excludeExtraneousValues: true });

      
    } catch (error) {
      throw new InternalServerErrorException(`Erreur lors de la récupération des produits : ${error.message}`);
      
    }
  }
}
