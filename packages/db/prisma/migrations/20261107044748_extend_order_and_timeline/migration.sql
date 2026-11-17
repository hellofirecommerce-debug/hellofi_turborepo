-- DropIndex
DROP INDEX "selling_orders_orderNo_idx";

-- AlterTable
ALTER TABLE "selling_orders" ADD COLUMN     "accessories" JSONB,
ADD COLUMN     "address" JSONB,
ADD COLUMN     "contactCity" TEXT,
ADD COLUMN     "customerResponse" TEXT,
ADD COLUMN     "dropToOfficeDate" TEXT,
ADD COLUMN     "dropToOfficeISODate" TEXT,
ADD COLUMN     "dropToOfficeSlotTimings" TEXT,
ADD COLUMN     "followupConvertedDate" TIMESTAMP(3),
ADD COLUMN     "followupScheduledDate" TIMESTAMP(3),
ADD COLUMN     "hasContactInCity" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "invoiceLink" TEXT,
ADD COLUMN     "isAgreedToTerms" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isFollowupConverted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isFullFilled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isLowValue" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isWhatsAppFollowUpRequired" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isWhatsAppFollowUpSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastFollowupDate" TIMESTAMP(3),
ADD COLUMN     "listedPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "orderTimelineName" TEXT,
ADD COLUMN     "pickupISODate" TEXT,
ADD COLUMN     "priceBreakdown" JSONB,
ADD COLUMN     "quotedPrice" DOUBLE PRECISION,
ADD COLUMN     "selfShipDate" TEXT,
ADD COLUMN     "selfShipISODate" TEXT,
ADD COLUMN     "serviceAvailable" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "order_timeline" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "message" TEXT,
    "description" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_timeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timelines" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "timelines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timeline_steps" (
    "id" TEXT NOT NULL,
    "timelineId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "timeline_steps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "order_timeline_orderId_createdAt_idx" ON "order_timeline"("orderId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "timelines_name_key" ON "timelines"("name");

-- CreateIndex
CREATE UNIQUE INDEX "timeline_steps_timelineId_position_key" ON "timeline_steps"("timelineId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "timeline_steps_timelineId_status_key" ON "timeline_steps"("timelineId", "status");

-- CreateIndex
CREATE INDEX "selling_orders_orderTimelineName_idx" ON "selling_orders"("orderTimelineName");

-- CreateIndex
CREATE INDEX "selling_orders_orderStatus_followupStatus_followupScheduled_idx" ON "selling_orders"("orderStatus", "followupStatus", "followupScheduledDate");

-- AddForeignKey
ALTER TABLE "selling_orders" ADD CONSTRAINT "selling_orders_orderTimelineName_fkey" FOREIGN KEY ("orderTimelineName") REFERENCES "timelines"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_timeline" ADD CONSTRAINT "order_timeline_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "selling_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timeline_steps" ADD CONSTRAINT "timeline_steps_timelineId_fkey" FOREIGN KEY ("timelineId") REFERENCES "timelines"("id") ON DELETE CASCADE ON UPDATE CASCADE;
