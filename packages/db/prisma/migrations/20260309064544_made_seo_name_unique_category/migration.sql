/*
  Warnings:

  - Added the required column `updatedAt` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BuyingCondition" AS ENUM ('UNBOXED', 'SUPERB', 'GOOD', 'FAIR', 'PARTIALLY_FAIR');

-- CreateEnum
CREATE TYPE "BuyingAvailability" AS ENUM ('IN_STOCK', 'OUT_OF_STOCK');

-- CreateEnum
CREATE TYPE "BuyingOS" AS ENUM ('WINDOWS', 'MACOS');

-- CreateEnum
CREATE TYPE "WarrantyType" AS ENUM ('HELLOFI_WARRANTY', 'BRAND_WARRANTY', 'NO_WARRANTY');

-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Banner" (
    "id" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "lg" TEXT NOT NULL,
    "sm" TEXT NOT NULL,
    "redirectUrl" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "seoName" TEXT NOT NULL,
    "categoryType" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "priority" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "seoName" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "brandBanner" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuyingProduct" (
    "id" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "productSubtitle" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "isTrending" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BuyingProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuyingVariant" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "shortId" TEXT NOT NULL,
    "liveLink" TEXT,
    "variantSubtitle" TEXT,
    "color" TEXT,
    "colorCode" TEXT,
    "storage" TEXT NOT NULL,
    "ram" TEXT,
    "price" DECIMAL(65,30) NOT NULL,
    "mrp" DECIMAL(65,30) NOT NULL,
    "emiBasePrice" DECIMAL(65,30),
    "quantity" INTEGER NOT NULL,
    "reservedQuantity" INTEGER NOT NULL DEFAULT 0,
    "productSpec" TEXT,
    "condition" "BuyingCondition" NOT NULL,
    "availability" "BuyingAvailability" NOT NULL DEFAULT 'IN_STOCK',
    "screenSize" TEXT,
    "os" "BuyingOS",
    "processor" TEXT,
    "batteryCapacity" TEXT,
    "warrantyType" "WarrantyType" NOT NULL,
    "warrantyDescription" TEXT,
    "whatsInTheBox" TEXT[],
    "whatsExtra" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BuyingVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuyingProductImage" (
    "id" TEXT NOT NULL,
    "variantId" TEXT,
    "productId" TEXT,
    "xs" TEXT,
    "sm" TEXT,
    "md" TEXT,
    "lg" TEXT,
    "alt" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BuyingProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuyingSpecification" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "group" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BuyingSpecification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_seoName_key" ON "Category"("seoName");

-- CreateIndex
CREATE UNIQUE INDEX "BuyingProduct_slug_key" ON "BuyingProduct"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BuyingVariant_shortId_key" ON "BuyingVariant"("shortId");

-- CreateIndex
CREATE INDEX "BuyingVariant_shortId_idx" ON "BuyingVariant"("shortId");

-- CreateIndex
CREATE INDEX "sessions_sessionToken_idx" ON "sessions"("sessionToken");

-- AddForeignKey
ALTER TABLE "Brand" ADD CONSTRAINT "Brand_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyingProduct" ADD CONSTRAINT "BuyingProduct_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyingProduct" ADD CONSTRAINT "BuyingProduct_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyingVariant" ADD CONSTRAINT "BuyingVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "BuyingProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyingProductImage" ADD CONSTRAINT "BuyingProductImage_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "BuyingVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyingProductImage" ADD CONSTRAINT "BuyingProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "BuyingProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuyingSpecification" ADD CONSTRAINT "BuyingSpecification_productId_fkey" FOREIGN KEY ("productId") REFERENCES "BuyingProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;
