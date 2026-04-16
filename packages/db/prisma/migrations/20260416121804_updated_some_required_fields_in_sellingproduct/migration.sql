/*
  Warnings:

  - You are about to drop the column `brandSeoName` on the `selling_products` table. All the data in the column will be lost.
  - You are about to drop the column `categoryName` on the `selling_products` table. All the data in the column will be lost.
  - You are about to drop the column `categorySeoName` on the `selling_products` table. All the data in the column will be lost.
  - You are about to drop the column `productBrand` on the `selling_products` table. All the data in the column will be lost.
  - You are about to drop the column `productType` on the `selling_products` table. All the data in the column will be lost.
  - You are about to drop the column `seriesName` on the `selling_products` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[productSeoName]` on the table `selling_products` will be added. If there are existing duplicate values, this will fail.
  - Made the column `productName` on table `selling_products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `seriesId` on table `selling_products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image` on table `selling_products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `brandId` on table `selling_products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `productSeoName` on table `selling_products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `categoryId` on table `selling_products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `storage` on table `selling_variants` required. This step will fail if there are existing NULL values in that column.
  - Made the column `productPrice` on table `selling_variants` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sellingProductId` on table `selling_variants` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "selling_products" DROP CONSTRAINT "selling_products_brandId_fkey";

-- DropForeignKey
ALTER TABLE "selling_products" DROP CONSTRAINT "selling_products_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "selling_products" DROP CONSTRAINT "selling_products_seriesId_fkey";

-- AlterTable
ALTER TABLE "selling_products" DROP COLUMN "brandSeoName",
DROP COLUMN "categoryName",
DROP COLUMN "categorySeoName",
DROP COLUMN "productBrand",
DROP COLUMN "productType",
DROP COLUMN "seriesName",
ALTER COLUMN "productName" SET NOT NULL,
ALTER COLUMN "seriesId" SET NOT NULL,
ALTER COLUMN "image" SET NOT NULL,
ALTER COLUMN "brandId" SET NOT NULL,
ALTER COLUMN "productSeoName" SET NOT NULL,
ALTER COLUMN "categoryId" SET NOT NULL;

-- AlterTable
ALTER TABLE "selling_variants" ALTER COLUMN "storage" SET NOT NULL,
ALTER COLUMN "productPrice" SET NOT NULL,
ALTER COLUMN "sellingProductId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "selling_products_productSeoName_key" ON "selling_products"("productSeoName");

-- AddForeignKey
ALTER TABLE "selling_products" ADD CONSTRAINT "selling_products_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "selling_products" ADD CONSTRAINT "selling_products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "selling_products" ADD CONSTRAINT "selling_products_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "series"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
