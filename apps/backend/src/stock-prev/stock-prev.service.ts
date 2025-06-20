import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { format, subDays, isSameDay } from 'date-fns';

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

async generateStableFakeCommandesForProduct(produitId: number, nombre: number = 28) {
  const produit = await this.prisma.produit.findUnique({ where: { id: produitId } });
  if (!produit) throw new Error("Produit non trouvé");

  const jours = 7;
  const commandesParJour = Math.floor(nombre / jours);
  const reste = nombre % jours;

  let compteur = 0;
  for (let i = 0; i < jours; i++) {
    const dateCommande = subDays(new Date(), jours - 1 - i);
    // Répartir équitablement le reste sur les premiers jours
    const commandesCeJour = commandesParJour + (i < reste ? 1 : 0);

    for (let k = 0; k < commandesCeJour; k++) {
      const total = Number(produit.prix);

      await this.prisma.commande.create({
        data: {
          clientEmail: `stableuser${compteur}@test.com`,
          adresse: '1 rue du Test',
          ville: 'Paris',
          codePostal: '75001',
          pays: 'France',
          total: total.toFixed(2),
          createdAt: dateCommande,
          produits: {
            create: [{
              produit: { connect: { id: produit.id } },
              quantite: 1,
              prixUnitaire: produit.prix,
            }],
          },
        },
      });

      compteur++;
    }
  }

  return { message: `${compteur} commandes stables générées pour le produit ${produitId}.` };
}

async generateDecreasingFakeCommandesForProduct(produitId: number, nombre: number = 28) {
  const produit = await this.prisma.produit.findUnique({ where: { id: produitId } });
  if (!produit) throw new Error("Produit non trouvé");

  const jours = 7;
  const commandesParJour = [7, 6, 5, 4, 3, 2, 1]; // décroissant
  const totalPoids = commandesParJour.reduce((a, b) => a + b, 0);
  const facteur = nombre / totalPoids;
  const repartitionFinale = commandesParJour.map(p => Math.round(p * facteur));

  let compteur = 0;
  for (let i = 0; i < jours; i++) {
    const dateCommande = subDays(new Date(), jours - 1 - i);
    const commandesCeJour = repartitionFinale[i];

    for (let k = 0; k < commandesCeJour; k++) {
      const total = Number(produit.prix);

      await this.prisma.commande.create({
        data: {
          clientEmail: `decuser${compteur}@test.com`,
          adresse: '1 rue du Test',
          ville: 'Paris',
          codePostal: '75001',
          pays: 'France',
          total: total.toFixed(2),
          createdAt: dateCommande,
          produits: {
            create: [{
              produit: { connect: { id: produit.id } },
              quantite: 1,
              prixUnitaire: produit.prix,
            }],
          },
        },
      });

      compteur++;
    }
  }

  return { message: `${compteur} commandes décroissantes générées pour le produit ${produitId}.` };
}





async getStockMA(produitId: number) {
  const sevenDaysAgo = subDays(new Date(), 7);

  const produit = await this.prisma.produit.findUnique({
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
              clientEmail: true,
            },
          },
        },
      },
    },
  });

  if (!produit) throw new Error('Produit non trouvé');

  // Séparer les commandes selon l'adresse mail
  const types = {
    croissant: 'fakeuser',
    stable: 'stableuser',
    decroissant: 'decuser',
  };

  const resultats: Record<string, any> = {};

  for (const [type, prefix] of Object.entries(types)) {
    const commandesFiltrees = produit.commandes.filter(c =>
      c.commande.clientEmail?.startsWith(prefix)
    );

    const totalSales = commandesFiltrees.reduce((sum, c) => sum + c.quantite, 0);
    const dailySales = totalSales / 7;
    const joursRestants = dailySales > 0 ? Math.floor(produit.stock / dailySales) : Infinity;

    resultats[type] = {
      ventes7j: totalSales,
      forecastDemandeProchainJour: dailySales,
      joursRestants,
    };
  }

  return {
    id: produit.id,
    nom: produit.nom,
    stock: produit.stock,
    previsions: resultats,
  };
}



async getStockForecastSESForProduct(produitId: number, alpha = 0.3) {
  const sevenDaysAgo = subDays(new Date(), 7);

  const produit = await this.prisma.produit.findUnique({
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
              clientEmail: true,
            },
          },
        },
      },
    },
  });

  if (!produit) throw new Error('Produit non trouvé');

  const types = {
    croissant: 'fakeuser',
    stable: 'stableuser',
    decroissant: 'decuser',
  };

  const resultats: Record<string, any> = {};

  for (const [type, prefix] of Object.entries(types)) {
    // Initialiser un dictionnaire avec les 7 derniers jours
    const ventesParJour: Record<string, number> = {};
    for (let i = 0; i < 7; i++) {
      const day = format(subDays(new Date(), i), 'MM-dd');
      ventesParJour[day] = 0;
    }

    // Filtrer les commandes de ce type
    const commandesFiltrees = produit.commandes.filter(c =>
      c.commande.clientEmail?.startsWith(prefix)
    );

    // Remplir les ventes quotidiennes
    commandesFiltrees.forEach(c => {
      const day = format(new Date(c.commande.createdAt), 'MM-dd');
      if (ventesParJour[day] !== undefined) {
        ventesParJour[day] += c.quantite;
      }
    });

    // Trier du plus ancien au plus récent
    const ventesOrdonnees = Object.keys(ventesParJour)
      .sort()
      .map(day => ventesParJour[day]);

    // Appliquer le lissage exponentiel simple (SES)
    let forecast = ventesOrdonnees[0] ?? 0;
    for (let i = 1; i < ventesOrdonnees.length; i++) {
      forecast = alpha * ventesOrdonnees[i] + (1 - alpha) * forecast;
    }

    const totalVentes = ventesOrdonnees.reduce((a, b) => a + b, 0);
    const joursRestants = forecast > 0 ? Math.floor(produit.stock / forecast) : Infinity;

    resultats[type] = {
      ventes7j: totalVentes,
      forecastDemandeProchainJour: forecast,
      joursRestants,
    };
  }

  return {
    id: produit.id,
    nom: produit.nom,
    stock: produit.stock,
    previsions: resultats,
  };
}




async getStockForecastDESForProduct(produitId: number, alpha = 0.8, beta = 0.2) {
  const sevenDaysAgo = subDays(new Date(), 7);

  const produit = await this.prisma.produit.findUnique({
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
              clientEmail: true,
            },
          },
        },
      },
    },
  });

  if (!produit) throw new Error('Produit non trouvé');

  const types = {
    croissant: 'fakeuser',
    stable: 'stableuser',
    decroissant: 'decuser',
  };

  const resultats: Record<string, any> = {};

  for (const [type, prefix] of Object.entries(types)) {
    const ventesParJour: Record<string, number> = {};
    for (let i = 0; i < 7; i++) {
      const day = format(subDays(new Date(), i), 'MM-dd');
      ventesParJour[day] = 0;
    }

    const commandesFiltrees = produit.commandes.filter(c =>
      c.commande.clientEmail?.startsWith(prefix)
    );

    commandesFiltrees.forEach(c => {
      const day = format(new Date(c.commande.createdAt), 'MM-dd');
      if (ventesParJour[day] !== undefined) {
        ventesParJour[day] += c.quantite;
      }
    });

    const ventesOrdonnees = Object.keys(ventesParJour)
      .sort()
      .map(day => ventesParJour[day]);

    if (ventesOrdonnees.length < 2) {
      throw new Error(`Pas assez de commandes pour appliquer l'algorithme DES pour les commandes "${type}"`);
    }


    // Initialisation DES
    let L = ventesOrdonnees[0];
    let T = ventesOrdonnees[1] - ventesOrdonnees[0];

    for (let t = 1; t < ventesOrdonnees.length; t++) {
      const previousL = L;
      L = alpha * ventesOrdonnees[t] + (1 - alpha) * (L + T);
      T = beta * (L - previousL) + (1 - beta) * T;
    }

    const forecast = L + T;
    const joursRestants = forecast > 0 ? Math.floor(produit.stock / forecast) : Infinity;

    resultats[type] = {
      ventes7j: ventesOrdonnees.reduce((a, b) => a + b, 0),
      forecastDemandeProchainJour: forecast,
      joursRestants,
    };
  }

  return {
    id: produit.id,
    nom: produit.nom,
    stock: produit.stock,
    previsions: resultats,
  };
}




async getVenteSemaineParProduit(productId: number) {
  const today = new Date();
  const startDate = subDays(today, 6); // sur les 7 derniers jours


  const profils = {
    croissant: 'fakeuser',       
    stable: 'stableuser',       
    decroissant: 'decuser',   
  };

  const resultats: Record<string, { date: string; salesCount: number }[]> = {};

  for (const [profil, emailPrefix] of Object.entries(profils)) {
    // Initialiser le tableau de ventes à 0 pour chaque jour
    const result: { date: string; salesCount: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const date = subDays(today, 6 - i);
      result.push({
        date: format(date, 'dd-MM'),
        salesCount: 0,
      });
    }

    const commandes = await this.prisma.commande.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: today,
        },
        clientEmail: {
          startsWith: emailPrefix,
        },
        produits: {
          some: {
            produitId: productId,
          },
        },
      },
      select: {
        createdAt: true,
      },
    });

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

    resultats[profil] = result;
  }

  return resultats;
}


async DeleteFakeCommandes() {
  const deleted = await this.prisma.commande.deleteMany({
    where: {
      user: {
        email: {
          in: [
            'croissant@example.com',
            'stable@example.com',
            'decroissant@example.com',
          ],
        },
      },
    },
  });

  return {
    message: `${deleted.count} commandes des profils tests supprimées avec succès.`,
  };
}




}
