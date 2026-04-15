-- AlterTable
ALTER TABLE "inventory_products" ADD COLUMN     "bodyCondition" TEXT NOT NULL DEFAULT 'NO',
ADD COLUMN     "deviceIssues" TEXT,
ADD COLUMN     "hasBox" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasCharger" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasOriginalBill" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "screenCondition" TEXT NOT NULL DEFAULT 'NO',
ADD COLUMN     "warrantyPurchaseDate" TIMESTAMP(3),
ADD COLUMN     "warrantyType" TEXT NOT NULL DEFAULT 'ABOVE_1_YEAR';
