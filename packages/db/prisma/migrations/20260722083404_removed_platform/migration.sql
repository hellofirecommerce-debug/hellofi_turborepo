/*
  Warnings:

  - You are about to drop the column `platform` on the `BuyingProduct` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "BuyingProduct_categoryId_isTopSelling_platform_idx";

-- AlterTable
ALTER TABLE "BuyingProduct" DROP COLUMN "platform";

-- DropEnum
DROP TYPE "Platform";

-- CreateIndex
CREATE INDEX "BuyingProduct_categoryId_isTopSelling_idx" ON "BuyingProduct"("categoryId", "isTopSelling");
