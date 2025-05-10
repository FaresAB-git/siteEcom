/*
  Warnings:

  - You are about to drop the column `clientNom` on the `Commande` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Commande" DROP COLUMN "clientNom",
ADD COLUMN     "adresse" VARCHAR(255),
ADD COLUMN     "codePostal" VARCHAR(20),
ADD COLUMN     "pays" VARCHAR(100),
ADD COLUMN     "ville" VARCHAR(100);
