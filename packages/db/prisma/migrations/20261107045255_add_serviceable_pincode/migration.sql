-- CreateTable
CREATE TABLE "serviceable_pincodes" (
    "id" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "pinCodes" TEXT[],
    "isDropToOfficeAvailable" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "serviceable_pincodes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "serviceable_pincodes_city_idx" ON "serviceable_pincodes"("city");

-- CreateIndex
CREATE INDEX "serviceable_pincodes_pinCodes_idx" ON "serviceable_pincodes" USING GIN ("pinCodes");
