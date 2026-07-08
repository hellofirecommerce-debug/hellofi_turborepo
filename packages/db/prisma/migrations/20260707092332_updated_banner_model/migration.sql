/*
  Warnings:

  - You are about to drop the `Banner` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "BannerPlacement" AS ENUM ('HOME', 'BUY_ALL', 'BUY_MOBILE', 'BUY_LAPTOP', 'BUY_TABLET', 'BUY_SMARTWATCH', 'BUY_ACCESSORIES', 'SELL_MOBILE', 'SELL_LAPTOP', 'SELL_TABLET', 'SELL_SMARTWATCH', 'SELL_ACCESSORIES');

-- DropTable
DROP TABLE "Banner";

-- CreateTable
CREATE TABLE "banners" (
    "id" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "lg" TEXT NOT NULL,
    "sm" TEXT NOT NULL,
    "redirectUrl" TEXT,
    "placement" "BannerPlacement" NOT NULL DEFAULT 'HOME',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "banners_placement_isActive_priority_idx" ON "banners"("placement", "isActive", "priority");
