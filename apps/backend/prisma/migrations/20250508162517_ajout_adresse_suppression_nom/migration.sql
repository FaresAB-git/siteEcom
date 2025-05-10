/*
  Warnings:

  - Made the column `adresse` on table `Commande` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Commande" ALTER COLUMN "adresse" SET NOT NULL;
