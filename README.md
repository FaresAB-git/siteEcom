Rapport Projet 
Développement d’une application e-commerce fullstack


1. Introduction
Contexte du projet
Ce projet a été réalisé dans le cadre d’un enseignement en développement web, avec pour objectif de mettre en pratique les compétences acquises autour de la conception d’applications web modernes. Il s’agit d’un projet pédagogique, fictif, mais ancré dans des problématiques concrètes, comme celles rencontrées dans le développement de sites de commerce en ligne. L’approche adoptée vise à reproduire de manière réaliste les différentes fonctionnalités d’un site e-commerce complet, tout en respectant un cahier des charges structuré et orienté vers l’expérience utilisateur et la gestion de contenu.

Objectif principal de l'application
L’application développée a pour but de simuler le fonctionnement d’un site e-commerce classique. Elle comprend deux volets principaux :
•	Un espace public permettant à tout visiteur de consulter un catalogue de produits, de naviguer par collection, de gérer un panier et de simuler une commande.
•	Un espace d’administration privé réservé à un administrateur, qui permet la gestion complète des produits, des collections, ainsi que l’accès à des statistiques simples sur l’activité du site.
L’application permet ainsi de démontrer la conception d’un site à la fois interactif et administrable, avec une gestion dynamique des données.
Public cible / utilisateurs visés
L’application cible deux types d’utilisateurs distincts :
•	Les visiteurs / clients simulés, qui peuvent explorer les produits proposés, interagir avec l’interface (ajouts au panier, consultation de fiches, etc.), et simuler une commande.
•	L’administrateur du site, qui dispose d’un tableau de bord sécurisé lui permettant de gérer l’ensemble du contenu (produits, collections, images) et de visualiser des indicateurs de performance ou de stock.
Bien que le projet ne soit pas destiné à un déploiement commercial réel, il s’adresse à toute personne souhaitant comprendre ou tester le fonctionnement d’un site e-commerce moderne, dans un cadre d’apprentissage ou de démonstration technique.

2. Conception
2.1 Technologies utilisées
Backend
Pour le développement du backend, j’ai choisi d’utiliser NestJS, un framework Node.js moderne basé sur TypeScript. Bien que je ne l’aie jamais utilisé auparavant, je connaissais NestJS de nom et souhaitais profiter de ce projet pour découvrir un nouvel outil, plutôt que de me tourner vers des solutions que j’avais déjà expérimentées en cours comme Express. 

Concernant la base de données, j’ai opté pour PostgreSQL, hébergée localement via Docker pendant la phase de développement. Ce choix s’est fait principalement parce que PostgreSQL est largement utilisé avec NestJS, bien documenté et réputé pour sa robustesse. Par ailleurs, même si MongoDB (base NoSQL) aurait pu être une alternative, nous l’avions déjà utilisée dans d’autres projets de cours ; je voulais donc expérimenter un modèle relationnel plus classique pour diversifier mes compétences.
Pour faire le lien entre NestJS et la base de données, j’ai utilisé l’ORM Prisma. Mon choix s’est porté sur Prisma après avoir comparé les deux principaux outils compatibles avec NestJS : Prisma et TypeORM. Bien que les deux soient performants et populaires, j’ai trouvé la documentation de Prisma plus claire, et son approche déclarative ainsi que sa simplicité d’utilisation correspondaient mieux à mes besoins pour ce projet.
Frontend
Côté frontend, j’ai utilisé Next.js, un framework moderne basé sur React. J’avais déjà eu l’occasion de l’utiliser auparavant, et j’apprécie particulièrement son système de routage basé sur les fichiers, qui simplifie beaucoup la structure d’une application. Mon dernier projet ayant été réalisé avec Vue.js, ce projet m’a également permis de revenir à l’écosystème React.

2.2 Bibliothèques et outils tiers
En complément des frameworks principaux, certaines bibliothèques ont été utilisées pour répondre à des besoins fonctionnels spécifiques :
•	JWT (JSON Web Token) : utilisée pour gérer l’authentification des utilisateurs (connexion et accès à l’espace administrateur). J’ai choisi JWT car c’est une solution très populaire, bien documentée, et largement compatible avec NestJS, ce qui m’a permis de l’intégrer assez facilement.
•	Nodemailer : cette bibliothèque a été utilisée pour l’envoi d’emails, notamment pour transmettre la facture après une commande simulée. C’est la librairie la plus connue pour cette tâche en Node.js, et je n’en connaissais pas d’autres aussi largement utilisées.
•	PDFKit : elle m’a permis de générer dynamiquement les factures en PDF. Bien qu’il existe d’autres bibliothèques similaires (comme jsPDF ou pdfmake), j’ai choisi PDFKit car elle est simple à prendre en main, bien adaptée aux projets Node.js, et offre une bonne flexibilité pour générer des PDF personnalisés directement côté serveur.
•	Recharts : cette bibliothèque a été utilisée dans l’espace administrateur pour afficher des graphes simples (produits populaires, état du stock, etc.). J’ai choisi Recharts car elle est facile à utiliser, bien documentée, et populaire dans les projets React.

3. Architecture générale de l’application
L’application repose sur une architecture full-stack moderne, divisée en plusieurs couches bien distinctes : le frontend (interface utilisateur), le backend (gestion des données, logique métier, services), une base de données relationnelle, et quelques services externes. L’ensemble de ces composants communique principalement via une API REST.

3.1 Frontend (Next.js)
Le frontend est développé avec Next.js, un framework React qui permet une gestion efficace du routage, du rendering côté serveur et de la création d’interfaces dynamiques. Il se compose de deux grandes parties :
•	Pages publiques : accessibles à tous les utilisateurs, connectés ou non. Elles permettent de visualiser les produits et de simuler une commande.
•	Espace administrateur (Admin Panel) : réservé aux administrateurs, il permet la gestion des produits, l’accès à un dashboard avec des statistiques (affichées avec Recharts), et le téléchargement ou l’envoi des factures.
L’accès à cette zone est sécurisé grâce à un middleware de vérification du JWT, qui intercepte les requêtes pour valider l’authentification.
3.2 Backend (NestJS)
Le backend repose sur NestJS, un framework Node.js structuré autour d’un modèle modulaire et orienté objet. Il se compose de plusieurs modules :
•	API (CRUD) : gère toutes les routes de l’application (produits, commandes, utilisateurs).
•	Service PDF (PDFKit) : génère dynamiquement des factures en format PDF.
•	Service e-mail (Nodemailer + SMTP Gmail) : envoie automatiquement les factures par e-mail au client après une commande.
•	Service d’authentification : utilise JWT pour gérer la connexion des administrateurs et protéger les routes sensibles via le module AuthGuard de NestJS.

3.3 Base de données (PostgreSQL)
Les données sont stockées dans une base PostgreSQL hébergée dans un conteneur Docker pendant le développement. La base comprend notamment les tables suivantes :
•	Users : informations des administrateurs (login, mot de passe hashé…).
•	Produits : catalogue de produits (nom, prix, image, stock…).
•	Commandes : enregistrements des achats effectués (produits commandés, date, montant…).


L’interaction entre NestJS et PostgreSQL est assurée par Prisma, un ORM moderne et performant, qui facilite la manipulation des données avec un typage fort et une syntaxe claire.

3.4 Services externes
•	SMTP Gmail : utilisé via Nodemailer pour envoyer des e-mails contenant les factures.
•	Cloudinary : service d’hébergement d’images utilisé pour uploader et stocker les images de produits.

