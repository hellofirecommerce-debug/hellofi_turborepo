-- AlterTable
ALTER TABLE "BuyingProduct" ADD COLUMN     "isLuxe" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "BuyingProduct_categoryId_isLuxe_idx" ON "BuyingProduct"("categoryId", "isLuxe");
