/*
  Warnings:

  - A unique constraint covering the columns `[seoName]` on the table `Brand` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Brand_seoName_key" ON "Brand"("seoName");
