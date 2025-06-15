import { Injectable,  BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { InternalServerErrorException } from '@nestjs/common';


import { CreateCommandeWithProduitsDto } from 'src/dto/createComandWithProduct.dto';
import { CreateCommandeDto } from 'src/dto/command.dto';
import { CommandeResponseDto } from 'src/dto/commandResponse.dto';
import { ProductResponseDto } from 'src/dto/product-response.dto';
import { InvoiceService } from 'src/invoice/invoice.service';
import { MailService } from 'src/mail/mail.service';


@Injectable()
export class CommandeService {
  constructor(private prisma: PrismaService, private invoiceService: InvoiceService, private mailService: MailService) {}

  async createCommande(data: CreateCommandeWithProduitsDto) {
    const { commande, produits } = data;

    try {
      // Création de la commande
      const createdCommande = await this.prisma.commande.create({
        data: {
          userId: commande.userId ?? undefined,
          clientEmail: commande.clientEmail,
          total: commande.total,
          status: commande.status ?? 'en attente',
          adresse: commande.adresse
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

      //Récupérer les produits enregistrés avec prix et quantité
      const produitsEnregistres = await this.prisma.commandeProduit.findMany({
        where: { commandeId: createdCommande.id },
      });

      //Générer le PDF
      const pdfBuffer = await this.invoiceService.generateInvoicePdf(
        createdCommande,
        produitsEnregistres,
      );

      if (!createdCommande.clientEmail) { //verifier le mail pour l'envoie
        throw new BadRequestException('Aucune adresse email fournie pour cette commande.');
      }

      // Envoyer l'email avec la facture en pièce jointe
      await this.mailService.sendInvoiceEmail(
        createdCommande.clientEmail,
        pdfBuffer,
        createdCommande.id,
      );

      console.log("email envoyé");


      return createdCommande;
    } catch (err) {
      console.error('Erreur création commande :', err);
      throw new InternalServerErrorException('Impossible de créer la commande.');
    }
  }

  async getCommands() {
  try {
    const commandes = await this.prisma.commande.findMany();

    console.log(commandes)
    const response = plainToInstance(CommandeResponseDto, commandes, {excludeExtraneousValues: true, });
    //console.log(response)
    return response;
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes :', error);
    throw new InternalServerErrorException('Erreur lors de la récupération des commandes.');
  }
}

async getProduitsByCommanId(commandeId:number):Promise<ProductResponseDto[]>{
  try {
    const commande = await this.prisma.commande.findUnique({
    where:{id: commandeId},
  });

  if(!commande){
    throw new NotFoundException(`Commande avec l'id ${commandeId} non trouvée.`);
  }

  const produitsCommande = await this.prisma.commandeProduit.findMany({
    where:{commandeId},
    include:{produit:true},
  });

  const produits = produitsCommande.map((entry) => entry.produit);
  //console.log(produits)

  const response = plainToInstance(ProductResponseDto, produits, {excludeExtraneousValues: true, });
  return response
  } catch (error) {
    throw new InternalServerErrorException('Erreur lors de la récupération des produit de la commande');
  }
 
}




}
