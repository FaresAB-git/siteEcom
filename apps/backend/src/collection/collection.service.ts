import { Injectable } from '@nestjs/common';
import { CollectionDto } from 'src/dto/collection.dto';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CollectionResponseDto } from 'src/dto/collection-response.dto';
import { plainToInstance } from 'class-transformer';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { InternalServerErrorException } from '@nestjs/common';

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
}
