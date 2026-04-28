-- AlterTable
ALTER TABLE "inventory_products" ADD COLUMN     "exchangeValue" DECIMAL(65,30),
ADD COLUMN     "isExchangeItem" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "parentInventoryId" TEXT,
ADD COLUMN     "rootInventoryId" TEXT,
ADD COLUMN     "sourceInvoiceId" TEXT;

-- CreateIndex
CREATE INDEX "inventory_products_parentInventoryId_idx" ON "inventory_products"("parentInventoryId");

-- CreateIndex
CREATE INDEX "inventory_products_rootInventoryId_idx" ON "inventory_products"("rootInventoryId");

-- CreateIndex
CREATE INDEX "inventory_products_sourceInvoiceId_idx" ON "inventory_products"("sourceInvoiceId");

-- AddForeignKey
ALTER TABLE "inventory_products" ADD CONSTRAINT "inventory_products_parentInventoryId_fkey" FOREIGN KEY ("parentInventoryId") REFERENCES "inventory_products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_products" ADD CONSTRAINT "inventory_products_rootInventoryId_fkey" FOREIGN KEY ("rootInventoryId") REFERENCES "inventory_products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_products" ADD CONSTRAINT "inventory_products_sourceInvoiceId_fkey" FOREIGN KEY ("sourceInvoiceId") REFERENCES "invoices"("id") ON DELETE SET NULL ON UPDATE CASCADE;
