import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AvisResponseDto } from 'src/dto/avisResponse.dto';
import { CreateAvisDto } from 'src/dto/createAvis.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AvisService {

  constructor(private prisma: PrismaService) {}

  async createAvis(dto: CreateAvisDto): Promise<AvisResponseDto> {
    const { produitId, userId, note, commentaire } = dto;

    const produit = await this.prisma.produit.findUnique({
      where: { id: produitId },
    });

    if (!produit) {
      throw new Error("Produit non trouvé");
    }

    const avis = await this.prisma.avis.create({
      data: {
        produitId,
        userId,
        note,
        commentaire,
      },
    });

    return plainToInstance(AvisResponseDto, avis, { excludeExtraneousValues: true });
  }

}
