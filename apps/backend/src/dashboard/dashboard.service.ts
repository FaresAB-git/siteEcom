import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { startOfWeek, addDays, format, endOfWeek, subDays, isSameDay, addMinutes } from 'date-fns';
import { Prisma } from '@prisma/client';

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
    const startDate = subDays(today, 6); 

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


  //Simple Exponential Smoothing (SES) 
  async getStockForecastSES(alpha = 0.3) {
    const sevenDaysAgo = subDays(new Date(), 7);

    // Récupère les produits et leurs commandes des 7 derniers jours
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
            commande: {
              select: {
                createdAt: true,
              },
            },
          },
        },
      },
    });

    return products.map((product) => {

      const ventesParJour: Record<string, number> = {}; //dictionnaire avec toute les dates
      for (let i = 0; i < 7; i++) {
        const day = format(subDays(new Date(), i), 'MM-dd'); // format MM-DD
        ventesParJour[day] = 0;
      }
      //console.log(ventesParJour);

      product.commandes.forEach((c) => {
        const day = format(new Date(c.commande.createdAt), 'MM-dd'); //recupere la date de la commande
        if (ventesParJour[day] !== undefined) {       // verifie que la date de la commande est parmis les 7 derniers jour
          ventesParJour[day] += c.quantite;           //si oui on ajoute la quantité
        }
      })

      // 2) Trier les jours du plus ancien au plus récent
      const ventesOrdonnees = Object.keys(ventesParJour)
        .sort()
        .map((day) => ventesParJour[day]);
      console.log(ventesOrdonnees) //liste des ventes par jour dans l'ordre

      let forecast = ventesOrdonnees[0]; // Initialisation F₁ = D₁
      for (let i = 1; i < ventesOrdonnees.length; i++) {
        forecast = alpha * ventesOrdonnees[i] + (1 - alpha) * forecast; //formule SES
      }

      // 4) Calcul des jours restants
      const joursRestants = forecast > 0 ? Math.floor(product.stock / forecast) : Infinity;

      return {
        id: product.id,
        nom: product.nom,
        stock: product.stock,
        ventes7j: ventesOrdonnees.reduce((a, b) => a + b, 0), //vente totales sur les 7 jours
        forecastDemandeProchainJour: forecast,
        joursRestants,
      };
    })
  }

    async getStockForecastDES(alpha = 0.8, beta = 0.2) {
    const sevenDaysAgo = subDays(new Date(), 7);

    // Récupère les produits et leurs commandes des 7 derniers jours
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
            commande: {
              select: {
                createdAt: true,
              },
            },
          },
        },
      },
    });

    return products.map((product) => {

      const ventesParJour: Record<string, number> = {}; //dictionnaire avec toute les dates
      for (let i = 0; i < 7; i++) {
        const day = format(subDays(new Date(), i), 'MM-dd'); // format MM-DD
        ventesParJour[day] = 0;
      }
      //console.log(ventesParJour);

      product.commandes.forEach((c) => {
        const day = format(new Date(c.commande.createdAt), 'MM-dd'); //recupere la date de la commande
        if (ventesParJour[day] !== undefined) {       // verifie que la date de la commande est parmis les 7 derniers jour
          ventesParJour[day] += c.quantite;           //si oui on ajoute la quantité
        }
      })

      // 2) Trier les jours du plus ancien au plus récent
      const ventesOrdonnees = Object.keys(ventesParJour)
        .sort()
        .map((day) => ventesParJour[day]);
      console.log(ventesOrdonnees) //liste des ventes par jour dans l'ordre

      // Initialisation
    let L = ventesOrdonnees[0];                          // Niveau initial
    let T = ventesOrdonnees[1] - ventesOrdonnees[0];     // Tendance initiale

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

    })
    
  }

  async getVentesParCollection(){
    
  
    //recupere les collections avec les produits et les commandes pour chaque produits
    const ventesParCollection = await this.prisma.collection.findMany({
    include: {
      produits: {
        include: {
          produit: {
            include: {
              commandes: true, 
            },
          },
        },
      },
    },
    });

    const resultats = ventesParCollection.map((collection) => {
      let totalQuantite = 0;
      let totalVentes = 0;

      for (const cp of collection.produits) {
        for (const commande of cp.produit.commandes) {
          totalQuantite += commande.quantite;
          totalVentes += parseFloat(commande.prixUnitaire.toString()) * commande.quantite;
        }
      }

      return {
        collectionId: collection.id,
        nom: collection.nom,
        totalQuantite,
        totalVentes,
      };
    });

    return resultats;
  }

  async generateFakeCommandes(nombre: number = 20) {
    const produits = await this.prisma.produit.findMany();

    for (let i = 0; i < nombre; i++) {
      let total = 0;

      const nbProduits = Math.floor(Math.random() * 3) + 1;
      const produitsDansCommande: Prisma.CommandeProduitCreateWithoutCommandeInput[] = [];

      for (let j = 0; j < nbProduits; j++) {
        const produit = produits[Math.floor(Math.random() * produits.length)];
        const quantite = Math.floor(Math.random() * 3) + 1;

        produitsDansCommande.push({
          produit: {
            connect: { id: produit.id },
          },
          quantite,
          prixUnitaire: produit.prix,
        });

        total += quantite * Number(produit.prix);
      }

      const randomDate = addDays(
        subDays(new Date(), 30),
        Math.floor(Math.random() * 30)
      );

      await this.prisma.commande.create({
        data: {
          clientEmail: `fakeuser${i}@test.com`,
          adresse: '1 rue du Test',
          ville: 'Paris',
          codePostal: '75001',
          pays: 'France',
          total: total.toFixed(2),
          createdAt: randomDate,
          produits: {
            create: produitsDansCommande,
          },
        },
      });
    }

    return { message: `${nombre} fausses commandes générées avec succès.` };
  }

  async DeleteFakeCommandes() {
  const deleted = await this.prisma.commande.deleteMany({
    where: {
      clientEmail: {
        startsWith: 'fakeuser',
      },
    },
  });

  return {
    message: `${deleted.count} fausses commandes supprimées avec succès.`,
  };
}
  
}
