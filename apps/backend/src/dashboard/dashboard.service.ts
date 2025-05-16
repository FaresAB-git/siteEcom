import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { startOfWeek, addDays, format, endOfWeek, subDays, isSameDay } from 'date-fns';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getVenteSemaine() {
    const today = new Date();
    const startDate = subDays(today, 6); // il y a 6 jours (donc total 7 jours avec aujourd’hui)

    // Récupération des ventes sur les 7 derniers jours
    const commandes = await this.prisma.commande.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: today,
        },
      },
      select: {
        createdAt: true,
      },
    });

    // Initialiser le tableau résultat avec 0 ventes
    const result: { date: string; salesCount: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const date = subDays(today, 6 - i); // pour que les dates soient dans l’ordre chronologique
      result.push({
        date: format(date, 'dd-MM'), // format sans l'année
        salesCount: 0,
      });
    }

    // Compter les ventes pour chaque jour
    commandes.forEach((cmd) => {
      for (let i = 0; i < 7; i++) {
        const date = subDays(today, 6 - i);
        if (isSameDay(cmd.createdAt, date)) {
          result[i].salesCount++;
          break;
        }
      }
    });

    return result;
  }

  async getChiffreAffairesSemaine() {
    const today = new Date();
    const startDate = subDays(today, 6); // 7 jours glissants

    // Récupérer toutes les commandes dans l'intervalle
    const commandes = await this.prisma.commande.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: today,
        },
      },
      select: {
        createdAt: true,
        total: true,
      },
    });

    // Initialiser les résultats avec total à 0
    const result: { date: string; total: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const date = subDays(today, 6 - i);
      result.push({
        date: format(date, 'dd-MM'),
        total: 0,
      });
    }

    // Additionner les totaux par jour
    commandes.forEach((cmd) => {
      for (let i = 0; i < 7; i++) {
        const date = subDays(today, 6 - i);
        if (isSameDay(cmd.createdAt, date)) {
          result[i].total += Number(cmd.total); // au cas où `total` serait un Decimal
          break;
        }
      }
    });

    return result;
  }

  async getStockForecast() {
    const sevenDaysAgo = subDays(new Date(), 7);

    // Récupère tous les produits avec leurs ventes dans les 7 derniers jours
    const products = await this.prisma.produit.findMany({
      include: {
        commandes: {
          where: {
            commande: {
              createdAt: {
                gte: sevenDaysAgo,
              },
            },
          },
          select: {
            quantite: true,
          },
        },
      },
    });

    return products.map((product) => {
      const totalSales = product.commandes.reduce((sum, c) => sum + c.quantite, 0);
      const dailySales = totalSales / 7;
      const joursRestants = dailySales > 0 ? Math.floor(product.stock / dailySales) : Infinity;  //infinity si il n'y a pas de commande et que le stock ne diminue jamais

      return {
        id: product.id,
        nom: product.nom,
        stock: product.stock,
        ventes7j: totalSales,
        joursRestants,
      };
    });
  }
}
