/*
  Warnings:

  - You are about to drop the column `rack` on the `inventory_products` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "InventoryCupboard" AS ENUM ('CUPBOARD_1', 'CUPBOARD_2', 'CUPBOARD_3', 'CUPBOARD_4');

-- DropIndex
DROP INDEX "inventory_products_rack_idx";

-- AlterTable
ALTER TABLE "inventory_products" DROP COLUMN "rack",
ADD COLUMN     "cupboard" "InventoryCupboard";

-- DropEnum
DROP TYPE "InventoryRack";

-- CreateIndex
CREATE INDEX "inventory_products_cupboard_idx" ON "inventory_products"("cupboard");
