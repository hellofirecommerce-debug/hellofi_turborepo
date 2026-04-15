-- AlterTable
ALTER TABLE "inventory_products" ADD COLUMN     "invoiceNumber" TEXT;

-- CreateIndex
CREATE INDEX "inventory_products_invoiceNumber_idx" ON "inventory_products"("invoiceNumber");
