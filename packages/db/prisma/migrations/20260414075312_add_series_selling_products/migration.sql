-- CreateTable
CREATE TABLE "series" (
    "id" TEXT NOT NULL,
    "brandName" TEXT,
    "brandId" TEXT,
    "brandSeoName" TEXT,
    "categoryName" TEXT,
    "categoryId" TEXT,
    "categorySeoName" TEXT,
    "seriesName" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "series_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "selling_products" (
    "id" TEXT NOT NULL,
    "productName" TEXT,
    "releasedYear" INTEGER,
    "launchedDate" TIMESTAMP(3),
    "seriesName" TEXT,
    "seriesId" TEXT,
    "productType" TEXT,
    "image" TEXT,
    "productBrand" TEXT,
    "brandId" TEXT,
    "productSeoName" TEXT,
    "brandSeoName" TEXT,
    "categorySeoName" TEXT,
    "categoryName" TEXT,
    "categoryId" TEXT,
    "productPrice" DOUBLE PRECISION,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "hasVariants" BOOLEAN NOT NULL DEFAULT false,
    "isConstantRam" BOOLEAN NOT NULL DEFAULT false,
    "ram" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "selling_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "selling_variants" (
    "id" TEXT NOT NULL,
    "ram" TEXT,
    "storage" TEXT,
    "productPrice" DOUBLE PRECISION,
    "sellingProductId" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "selling_variants_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "series" ADD CONSTRAINT "series_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "series" ADD CONSTRAINT "series_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "selling_products" ADD CONSTRAINT "selling_products_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "series"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "selling_products" ADD CONSTRAINT "selling_products_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "selling_products" ADD CONSTRAINT "selling_products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "selling_variants" ADD CONSTRAINT "selling_variants_sellingProductId_fkey" FOREIGN KEY ("sellingProductId") REFERENCES "selling_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
