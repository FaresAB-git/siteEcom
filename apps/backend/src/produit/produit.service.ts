import { Injectable } from '@nestjs/common';
import { ProdDto } from 'src/dto/product.dto';
import { ProductResponseDto } from 'src/dto/product-response.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { plainToInstance } from 'class-transformer';
import { InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class ProduitService {
  constructor(private prisma: PrismaService) {}

  async createProduct(prod: ProdDto) {
    console.log('service creation prod');
    try {
      const product = await this.prisma.produit.create({
        data: {
          nom: prod.nom,
          description: prod.description,
          imgPath: prod.imgPath,
          prix: prod.prix,
          stock: prod.stock,
        },
      });
      return product;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw error;
      }
      throw new InternalServerErrorException('Erreur lors de la création du produit');
    }
  }

  // produit.service.ts
  async getProducts():Promise<ProductResponseDto[]>  {
    try {
      const produits = await this.prisma.produit.findMany({include:{collections:{include:{collection:true}}}});
      return plainToInstance(ProductResponseDto, produits, { excludeExtraneousValues: true });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw error;
      }
      throw new InternalServerErrorException('Erreur lors de la récupération des produits');
    }
  }

  async getProduct(productId: number): Promise<ProductResponseDto>{
    try {
      const produit = await this.prisma.produit.findUnique({
        where: { id: productId }, 
        include:{collections:
          {include:{
            collection:true
            }
          }}
      });
      console.log(produit);
      return plainToInstance(ProductResponseDto, produit, { excludeExtraneousValues: true }); 
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw error;
      }
      throw new InternalServerErrorException('Erreur lors de la récupération du produit');
    }
  }

  async delProduct(productId: number): Promise<ProductResponseDto>{
    try {
      const produit = await this.prisma.produit.delete({
        where: {id: productId},
      });
      return plainToInstance(ProductResponseDto, produit, { excludeExtraneousValues: true });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw error;
      }
      throw new InternalServerErrorException('Erreur lors de la suppression du produit');
    }
  }

  async updateProduct(id: number, prod: ProdDto) {
    try {
      const existingProduct = await this.prisma.produit.findUnique({ where: { id } });
      if (!existingProduct) {
        throw new Error(`Produit avec l'id ${id} introuvable`);
      }
  
      const updated = await this.prisma.produit.update({
        where: { id },
        data: {
          nom: prod.nom,
          description: prod.description,
          imgPath: prod.imgPath,
          prix: prod.prix,
          stock: prod.stock,
        },
      });
  
      return updated;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw error;
      }
      throw new InternalServerErrorException('Erreur lors de la mise à jour du produit');
    }
  }

  async getNewProduct(): Promise<ProductResponseDto[]>{
    try {
      const produits = await this.prisma.produit.findMany({
        orderBy: { createdAt: 'desc'},
        take:5
      });
      return plainToInstance(ProductResponseDto, produits, { excludeExtraneousValues: true }); 

    } catch (error) {
      console.error('Erreur dans getNewProduct:', error);
      if (error instanceof PrismaClientKnownRequestError) {
        throw error;
      }
      throw new InternalServerErrorException('Erreur lors de la récupération des produits');
    }
  }
}



