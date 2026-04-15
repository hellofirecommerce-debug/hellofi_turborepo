/*
  Warnings:

  - You are about to drop the column `bankDetails` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `companyAddress` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `companyContact` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `companyEmail` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `companyGstin` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `companyName` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `invoiceTerms` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `logoUrl` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `stampUrl` on the `invoices` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "invoices" DROP COLUMN "bankDetails",
DROP COLUMN "companyAddress",
DROP COLUMN "companyContact",
DROP COLUMN "companyEmail",
DROP COLUMN "companyGstin",
DROP COLUMN "companyName",
DROP COLUMN "invoiceTerms",
DROP COLUMN "logoUrl",
DROP COLUMN "stampUrl",
ADD COLUMN     "customBankDetails" TEXT,
ADD COLUMN     "customInvoiceTerms" TEXT;
