/*
  Warnings:

  - You are about to drop the column `invoiceNumber` on the `inventory_products` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "inventory_products_invoiceNumber_idx";

-- AlterTable
ALTER TABLE "inventory_products" DROP COLUMN "invoiceNumber";
