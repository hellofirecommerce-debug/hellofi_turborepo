/*
  Warnings:

  - The `paidBy` column on the `invoices` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "splitPaymentDetails" TEXT,
DROP COLUMN "paidBy",
ADD COLUMN     "paidBy" "PaymentMode";
