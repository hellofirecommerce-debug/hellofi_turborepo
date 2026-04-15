/*
  Warnings:

  - You are about to drop the column `serialNumber` on the `inventory_products` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "inventory_products_serialNumber_idx";

-- AlterTable
ALTER TABLE "inventory_products" DROP COLUMN "serialNumber";
