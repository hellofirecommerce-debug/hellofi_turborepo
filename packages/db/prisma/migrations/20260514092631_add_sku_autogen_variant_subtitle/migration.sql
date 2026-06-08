/*
  Warnings:

  - You are about to drop the column `shortId` on the `BuyingVariant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sku]` on the table `BuyingVariant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[inventoryProductId]` on the table `BuyingVariant` will be added. If there are existing duplicate values, this will fail.
  - Made the column `variantSubtitle` on table `BuyingVariant` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "BuyingVariant_shortId_idx";

-- DropIndex
DROP INDEX "BuyingVariant_shortId_key";

-- AlterTable
ALTER TABLE "BuyingVariant" DROP COLUMN "shortId",
ADD COLUMN     "inventoryProductId" TEXT,
ALTER COLUMN "variantSubtitle" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BuyingVariant_sku_key" ON "BuyingVariant"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "BuyingVariant_inventoryProductId_key" ON "BuyingVariant"("inventoryProductId");
