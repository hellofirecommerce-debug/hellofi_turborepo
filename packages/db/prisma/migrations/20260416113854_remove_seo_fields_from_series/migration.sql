/*
  Warnings:

  - You are about to drop the column `brandName` on the `series` table. All the data in the column will be lost.
  - You are about to drop the column `brandSeoName` on the `series` table. All the data in the column will be lost.
  - You are about to drop the column `categoryName` on the `series` table. All the data in the column will be lost.
  - You are about to drop the column `categorySeoName` on the `series` table. All the data in the column will be lost.
  - Made the column `brandId` on table `series` required. This step will fail if there are existing NULL values in that column.
  - Made the column `categoryId` on table `series` required. This step will fail if there are existing NULL values in that column.
  - Made the column `seriesName` on table `series` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "series" DROP CONSTRAINT "series_brandId_fkey";

-- DropForeignKey
ALTER TABLE "series" DROP CONSTRAINT "series_categoryId_fkey";

-- AlterTable
ALTER TABLE "series" DROP COLUMN "brandName",
DROP COLUMN "brandSeoName",
DROP COLUMN "categoryName",
DROP COLUMN "categorySeoName",
ALTER COLUMN "brandId" SET NOT NULL,
ALTER COLUMN "categoryId" SET NOT NULL,
ALTER COLUMN "seriesName" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "series" ADD CONSTRAINT "series_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "series" ADD CONSTRAINT "series_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
