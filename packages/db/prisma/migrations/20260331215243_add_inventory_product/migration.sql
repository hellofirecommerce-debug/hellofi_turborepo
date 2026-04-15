-- CreateEnum
CREATE TYPE "InventoryStatus" AS ENUM ('NOT_LISTED', 'LISTED', 'SOLD');

-- CreateEnum
CREATE TYPE "PaymentMode" AS ENUM ('CASH', 'UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'SPLIT_PAYMENT', 'RAZORPAY');

-- CreateTable
CREATE TABLE "inventory_products" (
    "id" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "imeiOrSerial" TEXT NOT NULL,
    "purchaseDate" TIMESTAMP(3) NOT NULL,
    "productName" TEXT NOT NULL,
    "costPrice" DECIMAL(65,30) NOT NULL,
    "otherCharges" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "brandId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT,
    "customerPhone" TEXT NOT NULL,
    "customerAddress" TEXT NOT NULL,
    "status" "InventoryStatus" NOT NULL DEFAULT 'NOT_LISTED',
    "sellingDate" TIMESTAMP(3),
    "sellingPrice" DECIMAL(65,30),
    "invoiceNumber" TEXT,
    "invoice" TEXT,
    "sellingCustomerName" TEXT,
    "sellingCustomerEmail" TEXT,
    "sellingCustomerPhone" TEXT,
    "sellingCustomerAddress" TEXT,
    "paymentMode" "PaymentMode",
    "receivedInBank" DECIMAL(65,30),
    "splitPaymentDetails" TEXT,
    "tat" INTEGER,
    "grossProfit" DECIMAL(65,30),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "inventory_products_serialNumber_idx" ON "inventory_products"("serialNumber");

-- CreateIndex
CREATE INDEX "inventory_products_imeiOrSerial_idx" ON "inventory_products"("imeiOrSerial");

-- CreateIndex
CREATE INDEX "inventory_products_customerEmail_idx" ON "inventory_products"("customerEmail");

-- CreateIndex
CREATE INDEX "inventory_products_customerPhone_idx" ON "inventory_products"("customerPhone");

-- CreateIndex
CREATE INDEX "inventory_products_sellingCustomerEmail_idx" ON "inventory_products"("sellingCustomerEmail");

-- CreateIndex
CREATE INDEX "inventory_products_sellingCustomerPhone_idx" ON "inventory_products"("sellingCustomerPhone");

-- CreateIndex
CREATE INDEX "inventory_products_invoiceNumber_idx" ON "inventory_products"("invoiceNumber");

-- CreateIndex
CREATE INDEX "inventory_products_purchaseDate_idx" ON "inventory_products"("purchaseDate");

-- CreateIndex
CREATE INDEX "inventory_products_sellingDate_idx" ON "inventory_products"("sellingDate");

-- CreateIndex
CREATE INDEX "inventory_products_status_idx" ON "inventory_products"("status");

-- AddForeignKey
ALTER TABLE "inventory_products" ADD CONSTRAINT "inventory_products_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_products" ADD CONSTRAINT "inventory_products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
