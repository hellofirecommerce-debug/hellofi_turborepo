-- CreateEnum
CREATE TYPE "SaleType" AS ENUM ('DIRECT', 'EXCHANGE');

-- CreateEnum
CREATE TYPE "InvoiceWarrantyType" AS ENUM ('BRAND', 'HELLOFI', 'NONE');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'FINALIZED', 'CANCELLED');

-- CreateTable
CREATE TABLE "invoice_company_settings" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "gstin" TEXT NOT NULL,
    "logoUrl" TEXT,
    "stampUrl" TEXT,
    "defaultInvoiceTermsBrand" TEXT NOT NULL,
    "defaultInvoiceTermsHellofi" TEXT NOT NULL,
    "defaultInvoiceTermsNone" TEXT NOT NULL,
    "defaultBankDetails" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoice_company_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_counters" (
    "id" TEXT NOT NULL,
    "financialYear" TEXT NOT NULL,
    "lastNumber" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoice_counters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "invoiceDate" TIMESTAMP(3) NOT NULL,
    "companySettingsId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyAddress" TEXT NOT NULL,
    "companyContact" TEXT NOT NULL,
    "companyEmail" TEXT NOT NULL,
    "companyGstin" TEXT NOT NULL,
    "logoUrl" TEXT,
    "stampUrl" TEXT,
    "clientName" TEXT NOT NULL,
    "clientAddress" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "clientContact" TEXT NOT NULL,
    "clientGstin" TEXT,
    "isInsideBangalore" BOOLEAN NOT NULL DEFAULT true,
    "paidBy" TEXT,
    "saleType" "SaleType" NOT NULL DEFAULT 'DIRECT',
    "warrantyType" "InvoiceWarrantyType" NOT NULL DEFAULT 'BRAND',
    "warrantyMonths" INTEGER,
    "grossValue" DOUBLE PRECISION NOT NULL,
    "taxAmount" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "exchangeValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "amountPaid" DOUBLE PRECISION NOT NULL,
    "cgst" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sgst" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "igst" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "invoiceTerms" TEXT NOT NULL,
    "bankDetails" TEXT NOT NULL,
    "pdfUrl" TEXT,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_items" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "serialNumber" TEXT,
    "hsnSac" TEXT,
    "qty" INTEGER NOT NULL,
    "uom" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "gross" DOUBLE PRECISION NOT NULL,
    "gstAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cgstPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cgstAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sgstPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sgstAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "igstPercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "igstAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoice_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_exchange_items" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "serialNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoice_exchange_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "invoice_counters_financialYear_key" ON "invoice_counters"("financialYear");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoiceNumber_key" ON "invoices"("invoiceNumber");

-- CreateIndex
CREATE INDEX "invoices_invoiceNumber_idx" ON "invoices"("invoiceNumber");

-- CreateIndex
CREATE INDEX "invoices_clientEmail_idx" ON "invoices"("clientEmail");

-- CreateIndex
CREATE INDEX "invoices_clientContact_idx" ON "invoices"("clientContact");

-- CreateIndex
CREATE INDEX "invoices_invoiceDate_idx" ON "invoices"("invoiceDate");

-- CreateIndex
CREATE INDEX "invoices_status_idx" ON "invoices"("status");

-- CreateIndex
CREATE INDEX "invoice_items_invoiceId_idx" ON "invoice_items"("invoiceId");

-- CreateIndex
CREATE INDEX "invoice_exchange_items_invoiceId_idx" ON "invoice_exchange_items"("invoiceId");

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_companySettingsId_fkey" FOREIGN KEY ("companySettingsId") REFERENCES "invoice_company_settings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_exchange_items" ADD CONSTRAINT "invoice_exchange_items_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;
