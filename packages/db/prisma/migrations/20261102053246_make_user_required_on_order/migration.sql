/*
  Warnings:

  - Made the column `userId` on table `selling_orders` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "selling_orders" DROP CONSTRAINT "selling_orders_userId_fkey";

-- AlterTable
ALTER TABLE "selling_orders" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "selling_orders" ADD CONSTRAINT "selling_orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
