import { Injectable } from '@nestjs/common';
import { ProdDto } from 'src/dto/product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

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


}


