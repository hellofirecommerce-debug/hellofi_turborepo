/*
  Warnings:

  - You are about to drop the `sub_conditions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sub_options` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[parentOptionId]` on the table `selling_conditions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "sub_conditions" DROP CONSTRAINT "sub_conditions_parentConditionId_fkey";

-- DropForeignKey
ALTER TABLE "sub_conditions" DROP CONSTRAINT "sub_conditions_parentOptionId_fkey";

-- DropForeignKey
ALTER TABLE "sub_options" DROP CONSTRAINT "sub_options_subConditionId_fkey";

-- AlterTable
ALTER TABLE "selling_conditions" ADD COLUMN     "parentOptionId" TEXT;

-- DropTable
DROP TABLE "sub_conditions";

-- DropTable
DROP TABLE "sub_options";

-- CreateIndex
CREATE UNIQUE INDEX "selling_conditions_parentOptionId_key" ON "selling_conditions"("parentOptionId");

-- AddForeignKey
ALTER TABLE "selling_conditions" ADD CONSTRAINT "selling_conditions_parentOptionId_fkey" FOREIGN KEY ("parentOptionId") REFERENCES "selling_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;
