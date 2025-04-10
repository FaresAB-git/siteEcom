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
      throw new InternalServerErrorException('Erreur lors de la création de la collection');
    }
  }

  // produit.service.ts
  async getProducts():Promise<ProductResponseDto[]>  {
    try {
      const produits = await this.prisma.produit.findMany();
      return plainToInstance(ProductResponseDto, produits, { excludeExtraneousValues: true });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw error;
      }
      throw new InternalServerErrorException('Erreur lors de la création de la collection');
    }
  }

  async getProduct(productId: number): Promise<ProductResponseDto>{
    try {
      const produit = await this.prisma.produit.findUnique({
        where: { id: productId }, 
      });
      return plainToInstance(ProductResponseDto, produit, { excludeExtraneousValues: true }); 
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw error;
      }
      throw new InternalServerErrorException('Erreur lors de la création de la collection');
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
      throw new InternalServerErrorException('Erreur lors de la création de la collection');
    }
  }
}

