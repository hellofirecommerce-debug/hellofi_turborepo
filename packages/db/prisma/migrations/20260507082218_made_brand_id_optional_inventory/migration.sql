-- DropForeignKey
ALTER TABLE "inventory_products" DROP CONSTRAINT "inventory_products_brandId_fkey";

-- AlterTable
ALTER TABLE "inventory_products" ALTER COLUMN "brandId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "inventory_products" ADD CONSTRAINT "inventory_products_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;
