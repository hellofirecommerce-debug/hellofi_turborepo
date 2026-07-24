/*
  Warnings:

  - You are about to drop the column `isMostLoved` on the `BuyingProduct` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "FeaturedSection" AS ENUM ('NONE', 'MOST_LOVED', 'PEOPLE_LOVE');

-- AlterTable
ALTER TABLE "BuyingProduct" DROP COLUMN "isMostLoved",
ADD COLUMN     "featuredSection" "FeaturedSection" NOT NULL DEFAULT 'NONE';

-- CreateIndex
CREATE INDEX "BuyingProduct_categoryId_featuredSection_idx" ON "BuyingProduct"("categoryId", "featuredSection");
