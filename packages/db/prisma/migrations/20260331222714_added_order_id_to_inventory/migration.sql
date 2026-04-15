/*
  Warnings:

  - Added the required column `orderId` to the `inventory_products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "inventory_products" ADD COLUMN     "orderId" TEXT NOT NULL;
