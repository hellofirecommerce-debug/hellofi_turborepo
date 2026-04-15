/*
  Warnings:

  - You are about to drop the column `brandBanner` on the `Brand` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Brand` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "Brand" DROP COLUMN "brandBanner",
DROP COLUMN "status";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "BrandCategory" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrandCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BrandCategory_brandId_categoryId_key" ON "BrandCategory"("brandId", "categoryId");

-- AddForeignKey
ALTER TABLE "BrandCategory" ADD CONSTRAINT "BrandCategory_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandCategory" ADD CONSTRAINT "BrandCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
