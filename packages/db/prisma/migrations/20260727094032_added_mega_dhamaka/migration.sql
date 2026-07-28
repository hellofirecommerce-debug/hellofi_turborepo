-- AlterTable
ALTER TABLE "BuyingProduct" ADD COLUMN     "isMegaDhamaka" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "BuyingProduct_categoryId_isMegaDhamaka_idx" ON "BuyingProduct"("categoryId", "isMegaDhamaka");
