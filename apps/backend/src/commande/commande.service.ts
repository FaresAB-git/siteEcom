import { Injectable,  BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { InternalServerErrorException } from '@nestjs/common';


import { CreateCommandeWithProduitsDto } from 'src/dto/createComandWithProduct.dto';


@Injectable()
export class CommandeService {
  constructor(private prisma: PrismaService) {}

  async createCommande(data: CreateCommandeWithProduitsDto) {
    const { commande, produits } = data;

    try {
      // Création de la commande
      const createdCommande = await this.prisma.commande.create({
        data: {
          clientNom: commande.clientNom,
          clientEmail: commande.clientEmail,
          total: commande.total,
          status: commande.status ?? 'en attente',
        },
      });

      const produitsData = produits.map((p) => ({
        commandeId: createdCommande.id,
        produitId: p.produitId,
        quantite: p.quantite,
        prixUnitaire: p.prixUnitaire,
      }));

      try {
        await this.prisma.commandeProduit.createMany({
          data: produitsData,
        });
      } catch (err) {
       
        throw new BadRequestException('Erreur lors de l ajout des produits à la commande');
      }

      return createdCommande;
    } catch (err) {
      console.error('Erreur création commande :', err);
      throw new InternalServerErrorException('Impossible de créer la commande.');
    }
  }
}
