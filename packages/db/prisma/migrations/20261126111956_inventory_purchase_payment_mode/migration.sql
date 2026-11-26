-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "InventoryStatus" ADD VALUE 'ADVANCE_PAID';
ALTER TYPE "InventoryStatus" ADD VALUE 'UNDER_CLAIM';
ALTER TYPE "InventoryStatus" ADD VALUE 'NEED_TO_REPAIR';

-- AlterTable
ALTER TABLE "inventory_products" ADD COLUMN     "purchasePaymentMode" "PaymentMode";
