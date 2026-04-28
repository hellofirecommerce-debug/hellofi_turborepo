/*
  Warnings:

  - A unique constraint covering the columns `[inventoryProductId]` on the table `invoice_items` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "invoice_items" ADD COLUMN     "inventoryProductId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "invoice_items_inventoryProductId_key" ON "invoice_items"("inventoryProductId");

-- CreateIndex
CREATE INDEX "invoice_items_inventoryProductId_idx" ON "invoice_items"("inventoryProductId");

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_inventoryProductId_fkey" FOREIGN KEY ("inventoryProductId") REFERENCES "inventory_products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
