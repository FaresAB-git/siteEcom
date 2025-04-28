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
import { ConflictException } from '@nestjs/common';
import { CollectionProduitDto } from 'src/dto/collectionProduit.dto';


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

  async getCollections(): Promise<CollectionResponseDto[]> {
    try {
      const collecttions = await this.prisma.collection.findMany();
      return plainToInstance(CollectionResponseDto, collecttions, {excludeExtraneousValues: true,});
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw error;
      }
      throw new InternalServerErrorException('Erreur lors de la récupération des collections');
    }
  }

 

  
  async addProductToCollection(collectionId: number, productId: number): Promise<CollectionProduitDto> {
    try {
      const product = await this.prisma.produit.findUnique({
        where: { id: productId },
      });
      if (!product) {
        throw new NotFoundException(`Produit avec l'ID ${productId} introuvable`);
      }
  
      const collection = await this.prisma.collection.findUnique({
        where: { id: collectionId },
      });
      if (!collection) {
        throw new NotFoundException(`Collection avec l'ID ${collectionId} introuvable`);
      }
  
      const existingAssociation = await this.prisma.collectionProduit.findUnique({
        where: {
          collectionId_produitId: {
            collectionId,
            produitId: productId,
          },
        },
      });
  
      if (existingAssociation) {
        throw new ConflictException(`Le produit ${productId} est déjà dans la collection ${collectionId}`);
      }
  
      const association = await this.prisma.collectionProduit.create({
        data: {
          collectionId,
          produitId: productId,
        },
      });
  
      return plainToInstance(CollectionProduitDto, association, { excludeExtraneousValues: true });
    } catch (error) {
      // Laisse passer les erreurs NestJS standard
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
  
      if (error instanceof PrismaClientKnownRequestError) {
        throw error;
      }
  
      throw new InternalServerErrorException('Erreur lors de la création de la collection');
    }
  }
  
  
  async removeProductFromCollection(collectionId: number, productId: number) {
    try {
      // Vérifie si l'association existe
      const existingAssociation = await this.prisma.collectionProduit.findUnique({
        where: {
          collectionId_produitId: {
            collectionId,
            produitId: productId,
          },
        },
      });
  
      if (!existingAssociation) {
        throw new NotFoundException(
          `Le produit avec l'ID ${productId} n'est pas présent dans la collection ${collectionId}`,
        );
      }
  
      // Supprime l'association
      await this.prisma.collectionProduit.delete({
        where: {
          collectionId_produitId: {
            collectionId,
            produitId: productId,
          },
        },
      });
  
      return { message: 'Produit supprimé de la collection avec succès' };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw error;
      }
      throw new InternalServerErrorException('Erreur lors de la suppression du produit de la collection');
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


  async addMultipleProductsToCollection(collectionId: number, productIds: number[]): Promise<CollectionProduitDto[]> {
    try {
      const collection = await this.prisma.collection.findUnique({
        where: { id: collectionId },
      });
      if (!collection) {
        throw new NotFoundException(`Collection avec l'ID ${collectionId} introuvable`);
      }
  
      const addedProducts: CollectionProduitDto[] = [];
  
      for (const productId of productIds) {
        const product = await this.prisma.produit.findUnique({
          where: { id: productId },
        });
        if (!product) {
          throw new NotFoundException(`Produit avec l'ID ${productId} introuvable`);
        }
  
        const existingAssociation = await this.prisma.collectionProduit.findUnique({
          where: {
            collectionId_produitId: {
              collectionId,
              produitId: productId,
            },
          },
        });
  
        if (existingAssociation) {
          throw new ConflictException(`Le produit ${productId} est déjà dans la collection ${collectionId}`);
        }
  
        const association = await this.prisma.collectionProduit.create({
          data: {
            collectionId,
            produitId: productId,
          },
        });
  
        addedProducts.push(
          plainToInstance(CollectionProduitDto, association, { excludeExtraneousValues: true })
        );
      }
  
      return addedProducts;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
  
      if (error instanceof PrismaClientKnownRequestError) {
        throw error;
      }
  
      throw new InternalServerErrorException('Erreur lors de l\'ajout multiple de produits à la collection');
    }
  }
}
