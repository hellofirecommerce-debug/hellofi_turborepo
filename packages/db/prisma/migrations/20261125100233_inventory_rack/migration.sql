-- CreateEnum
CREATE TYPE "InventoryRack" AS ENUM ('RACK_1', 'RACK_2', 'RACK_3', 'RACK_4');

-- AlterTable
ALTER TABLE "inventory_products" ADD COLUMN     "rack" "InventoryRack";

-- CreateIndex
CREATE INDEX "inventory_products_rack_idx" ON "inventory_products"("rack");
