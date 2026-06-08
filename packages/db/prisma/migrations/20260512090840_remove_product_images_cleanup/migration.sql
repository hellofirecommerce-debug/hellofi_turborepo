/*
  Warnings:

  - You are about to drop the column `productId` on the `BuyingProductImage` table. All the data in the column will be lost.
  - Made the column `variantId` on table `BuyingProductImage` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "BuyingProductImage" DROP CONSTRAINT "BuyingProductImage_productId_fkey";

-- AlterTable
ALTER TABLE "BuyingProduct" ALTER COLUMN "brandId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "BuyingProductImage" DROP COLUMN "productId",
ALTER COLUMN "variantId" SET NOT NULL;

-- AlterTable
ALTER TABLE "BuyingVariant" ALTER COLUMN "storage" DROP NOT NULL;
