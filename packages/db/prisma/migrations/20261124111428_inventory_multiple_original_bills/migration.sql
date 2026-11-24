/*
  Warnings:

  - You are about to drop the column `originalBill` on the `inventory_products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "inventory_products" DROP COLUMN "originalBill";

-- CreateTable
CREATE TABLE "inventory_original_bills" (
    "id" TEXT NOT NULL,
    "inventoryId" TEXT NOT NULL,
    "fileKey" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_original_bills_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "inventory_original_bills_inventoryId_idx" ON "inventory_original_bills"("inventoryId");

-- AddForeignKey
ALTER TABLE "inventory_original_bills" ADD CONSTRAINT "inventory_original_bills_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventory_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
