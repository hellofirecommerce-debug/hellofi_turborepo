-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('IOS', 'ANDROID', 'WINDOWS', 'MACOS', 'NONE');

-- AlterTable
ALTER TABLE "BuyingProduct" ADD COLUMN     "isGaming" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isMostLoved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isTopSelling" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "platform" "Platform" NOT NULL DEFAULT 'NONE';

-- CreateIndex
CREATE INDEX "BuyingProduct_categoryId_isTrending_idx" ON "BuyingProduct"("categoryId", "isTrending");

-- CreateIndex
CREATE INDEX "BuyingProduct_categoryId_isTopSelling_platform_idx" ON "BuyingProduct"("categoryId", "isTopSelling", "platform");
