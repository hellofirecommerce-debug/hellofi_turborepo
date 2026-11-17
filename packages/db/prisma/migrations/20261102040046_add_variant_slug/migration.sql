/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `selling_variants` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('AWAITING_ADDRESS', 'AWAITING_PICKUP', 'AWAITING_PAYMENT', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('UPI', 'BANK', 'CASH');

-- AlterTable
ALTER TABLE "selling_variants" ADD COLUMN     "slug" TEXT;

-- CreateTable
CREATE TABLE "selling_orders" (
    "id" TEXT NOT NULL,
    "orderNo" TEXT NOT NULL,
    "userId" TEXT,
    "sellingProductId" TEXT NOT NULL,
    "variantId" TEXT,
    "categoryId" TEXT NOT NULL,
    "brandId" TEXT,
    "productName" TEXT NOT NULL,
    "productImage" TEXT,
    "brandName" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,
    "variantName" TEXT,
    "basePrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "quotedPriceBySystem" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pickupCharges" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "processingFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "selectedAnswers" JSONB NOT NULL,
    "orderStatus" "OrderStatus" NOT NULL DEFAULT 'AWAITING_ADDRESS',
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "isDropToOffice" BOOLEAN NOT NULL DEFAULT false,
    "pickupMethod" TEXT,
    "pickupDate" TEXT,
    "pickupSlot" TEXT,
    "serialOrIMEI" TEXT,
    "additionalNotes" TEXT,
    "paymentMethod" "PaymentMethod",
    "paymentDetails" JSONB,
    "followupStatus" TEXT,
    "followupCount" INTEGER NOT NULL DEFAULT 0,
    "followupNotes" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "selling_orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "selling_orders_orderNo_key" ON "selling_orders"("orderNo");

-- CreateIndex
CREATE INDEX "selling_orders_orderNo_idx" ON "selling_orders"("orderNo");

-- CreateIndex
CREATE INDEX "selling_orders_userId_idx" ON "selling_orders"("userId");

-- CreateIndex
CREATE INDEX "selling_orders_orderStatus_idx" ON "selling_orders"("orderStatus");

-- CreateIndex
CREATE UNIQUE INDEX "selling_variants_slug_key" ON "selling_variants"("slug");

-- AddForeignKey
ALTER TABLE "selling_orders" ADD CONSTRAINT "selling_orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "selling_orders" ADD CONSTRAINT "selling_orders_sellingProductId_fkey" FOREIGN KEY ("sellingProductId") REFERENCES "selling_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "selling_orders" ADD CONSTRAINT "selling_orders_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "selling_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "selling_orders" ADD CONSTRAINT "selling_orders_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "selling_orders" ADD CONSTRAINT "selling_orders_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;
