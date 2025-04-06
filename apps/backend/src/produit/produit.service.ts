import { Injectable } from '@nestjs/common';
import { ProdDto } from 'src/dto/product.dto';
import { ProductResponseDto } from 'src/dto/product-response.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { plainToInstance } from 'class-transformer';

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
    }
  }

  // produit.service.ts
  async getProducts():Promise<ProductResponseDto[]>  {
    const produits = await this.prisma.produit.findMany();
    //console.log({produits});
    
    return plainToInstance(ProductResponseDto, produits, { excludeExtraneousValues: true });
  }

  async getProduct(productId: number): Promise<ProductResponseDto>{
    const produit = await this.prisma.produit.findUnique({
      where: { id: productId }, 
    });
    return plainToInstance(ProductResponseDto, produit, { excludeExtraneousValues: true });
  }

  



}

