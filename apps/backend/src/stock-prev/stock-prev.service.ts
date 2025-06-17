import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { format, subDays } from 'date-fns';

@Injectable()
export class StockPrevService {
constructor(private prisma: PrismaService) {}


async generateGrowingFakeCommandesForProduct(produitId: number, nombre: number = 28) {
  const produit = await this.prisma.produit.findUnique({ where: { id: produitId } });
  if (!produit) throw new Error("Produit non trouvé");

  const jours = 7;
  const commandesParJour = [1, 2, 3, 4, 5, 6, 7];
  const totalPoids = commandesParJour.reduce((a, b) => a + b, 0);
  const facteur = nombre / totalPoids;
  const repartitionFinale = commandesParJour.map(p => Math.round(p * facteur));

  let compteur = 0;
  for (let i = 0; i < jours; i++) {
    const dateCommande = subDays(new Date(), jours - 1 - i);
    const commandesCeJour = repartitionFinale[i];

    for (let k = 0; k < commandesCeJour; k++) {
      //const quantite = Math.floor(Math.random() * 3) + 1;
      //const total = quantite * Number(produit.prix);
      const total = Number(produit.prix);

      await this.prisma.commande.create({
        data: {
          clientEmail: `fakeuser${compteur}@test.com`,
          adresse: '1 rue du Test',
          ville: 'Paris',
          codePostal: '75001',
          pays: 'France',
          total: total.toFixed(2),
          createdAt: dateCommande,
          produits: {
            create: [{
              produit: { connect: { id: produit.id } },
              quantite:1,
              prixUnitaire: produit.prix,
            }],
          },
        },
      });

      compteur++;
    }
  }

  return { message: `${compteur} commandes générées pour le produit ${produitId}.` };
}



async getStockMA(produitId: number) {
  const sevenDaysAgo = subDays(new Date(), 7);

  // Récupère un seul produit avec ses commandes des 7 derniers jours
  const product = await this.prisma.produit.findUnique({
    where: { id: produitId },
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

  if (!product) throw new Error('Produit non trouvé');

  // Calcul des ventes totales et quotidiennes moyennes
  const totalSales = product.commandes.reduce((sum, c) => sum + c.quantite, 0);
  const dailySales = totalSales / 7;
  const joursRestants = dailySales > 0 ? Math.floor(product.stock / dailySales) : Infinity;

  return {
    id: product.id,
    nom: product.nom,
    stock: product.stock,
    ventes7j: totalSales,
    forecastDemandeProchainJour: dailySales,
    joursRestants,
  };
}



async getStockForecastSESForProduct(produitId: number, alpha = 0.3) {
  const sevenDaysAgo = subDays(new Date(), 7);

  // Récupère un seul produit avec ses commandes des 7 derniers jours
  const product = await this.prisma.produit.findUnique({
    where: { id: produitId },
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
          commande: {
            select: {
              createdAt: true,
            },
          },
        },
      },
    },
  });

  if (!product) throw new Error('Produit non trouvé');

  // Initialiser un dictionnaire avec les 7 derniers jours
  const ventesParJour: Record<string, number> = {};
  for (let i = 0; i < 7; i++) {
    const day = format(subDays(new Date(), i), 'MM-dd');
    ventesParJour[day] = 0;
  }

  // Remplir avec les quantités vendues
  product.commandes.forEach((c) => {
    const day = format(new Date(c.commande.createdAt), 'MM-dd');
    if (ventesParJour[day] !== undefined) {
      ventesParJour[day] += c.quantite;
    }
  });

  // Trier du plus ancien au plus récent
  const ventesOrdonnees = Object.keys(ventesParJour)
    .sort()
    .map((day) => ventesParJour[day]);

  // Initialisation SES : F₁ = D₁
  let forecast = ventesOrdonnees[0];

  for (let i = 1; i < ventesOrdonnees.length; i++) {
    forecast = alpha * ventesOrdonnees[i] + (1 - alpha) * forecast;
  }

  const joursRestants = forecast > 0 ? Math.floor(product.stock / forecast) : Infinity;

  return {
    id: product.id,
    nom: product.nom,
    stock: product.stock,
    ventes7j: ventesOrdonnees.reduce((a, b) => a + b, 0),
    forecastDemandeProchainJour: forecast,
    joursRestants,
  };
}



async getStockForecastDESForProduct(produitId: number, alpha = 0.8, beta = 0.2) {
  const sevenDaysAgo = subDays(new Date(), 7);

  // Récupérer un seul produit avec ses commandes des 7 derniers jours
  const product = await this.prisma.produit.findUnique({
    where: { id: produitId },
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
          commande: {
            select: {
              createdAt: true,
            },
          },
        },
      },
    },
  });

  if (!product) throw new Error('Produit non trouvé');

  // Initialiser le dictionnaire des ventes par jour
  const ventesParJour: Record<string, number> = {};
  for (let i = 0; i < 7; i++) {
    const day = format(subDays(new Date(), i), 'MM-dd');
    ventesParJour[day] = 0;
  }

  // Remplir le dictionnaire avec les ventes réelles
  product.commandes.forEach((c) => {
    const day = format(new Date(c.commande.createdAt), 'MM-dd');
    if (ventesParJour[day] !== undefined) {
      ventesParJour[day] += c.quantite;
    }
  });

  // Obtenir les ventes dans l'ordre chronologique
  const ventesOrdonnees = Object.keys(ventesParJour)
    .sort()
    .map((day) => ventesParJour[day]);

  // Méthode de lissage exponentiel double (DES)
  let L = ventesOrdonnees[0]; // Niveau initial
  let T = ventesOrdonnees[1] - ventesOrdonnees[0]; // Tendance initiale

  for (let t = 1; t < ventesOrdonnees.length; t++) {
    const previousL = L;
    L = alpha * ventesOrdonnees[t] + (1 - alpha) * (L + T);
    T = beta * (L - previousL) + (1 - beta) * T;
  }

  const forecast = L + T;
  const joursRestants = forecast > 0 ? Math.floor(product.stock / forecast) : Infinity;

  return {
    id: product.id,
    nom: product.nom,
    stock: product.stock,
    ventes7j: ventesOrdonnees.reduce((a, b) => a + b, 0),
    forecastDemandeProchainJour: forecast,
    joursRestants,
  };
}


}
