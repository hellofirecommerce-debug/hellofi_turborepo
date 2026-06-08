-- AddForeignKey
ALTER TABLE "BuyingVariant" ADD CONSTRAINT "BuyingVariant_inventoryProductId_fkey" FOREIGN KEY ("inventoryProductId") REFERENCES "inventory_products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
