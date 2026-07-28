import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import prisma from "@repo/db";

const BATCH_SIZE = 10;

// ── Mongoose Schemas (mirroring your legacy collections) ──
const BuyingProductSchema = new mongoose.Schema(
  {
    productName: String,
    productSubtitle: String,
    slug: String,
    brand: String,
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: "mobilebrands" },
    brandSeoName: String,
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "category" },
    category: String,
    categorySeoName: String,
    isTrending: { type: Boolean, default: false },
  },
  { timestamps: true, strict: false },
);

const BuyingVariantSchema = new mongoose.Schema(
  {
    sku: String,
    imeiOrSerial: String,
    shortId: String,
    liveLink: String,
    variantSubtitle: String,
    color: String,
    colorCode: String,
    storage: String,
    ram: String,
    price: Number,
    mrp: Number,
    emiBasePrice: Number,
    quantity: Number,
    reservedQuantity: Number,
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "buyingProduct" },
    productSpec: String,
    condition: String,
    availability: String,
    screenSize: String,
    os: String,
    processor: String,
    batteryCapacity: String,
    warrantyType: String,
    warrantyDescription: String,
    whatsInTheBox: [String],
    whatsExtra: String,
  },
  { timestamps: true, strict: false },
);

const BuyingSpecificationSchema = new mongoose.Schema(
  {
    key: String,
    value: String,
    group: String,
    sortOrder: Number,
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "buyingProduct" },
  },
  { timestamps: true, strict: false },
);

const BuyingProductImagesSchema = new mongoose.Schema(
  {
    xs: String,
    sm: String,
    md: String,
    lg: String,
    alt: String,
    priority: { type: Number, default: 0 },
    isDefault: Boolean,
    variantId: { type: mongoose.Schema.Types.ObjectId, ref: "buyingVariant" },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "buyingProduct" },
  },
  { timestamps: true, strict: false },
);

const BuyingProductModel = mongoose.model("buyingProduct", BuyingProductSchema);
const BuyingVariantModel = mongoose.model("buyingVariant", BuyingVariantSchema);
const BuyingSpecificationModel = mongoose.model(
  "buyingSpecification",
  BuyingSpecificationSchema,
);
const BuyingProductImagesModel = mongoose.model(
  "buyingProductImages",
  BuyingProductImagesSchema,
);

// ── Enum mapping helpers ──
function mapCondition(
  value?: string,
): "UNBOXED" | "SUPERB" | "GOOD" | "FAIR" | "PARTIALLY_FAIR" {
  const map: Record<
    string,
    "UNBOXED" | "SUPERB" | "GOOD" | "FAIR" | "PARTIALLY_FAIR"
  > = {
    unboxed: "UNBOXED",
    superb: "SUPERB",
    good: "GOOD",
    fair: "FAIR",
    "partially fair": "PARTIALLY_FAIR",
    "brand new (unactivated)": "UNBOXED",
  };
  return map[(value ?? "").toLowerCase()] ?? "GOOD";
}

function mapAvailability(value?: string): "IN_STOCK" | "OUT_OF_STOCK" {
  return (value ?? "").toLowerCase() === "out of stock"
    ? "OUT_OF_STOCK"
    : "IN_STOCK";
}

function mapOS(value?: string | null): "WINDOWS" | "MACOS" | null {
  if (!value) return null;
  const v = value.toLowerCase();
  if (v === "windows") return "WINDOWS";
  if (v === "macos") return "MACOS";
  return null;
}

function mapWarrantyType(
  value?: string,
): "HELLOFI_WARRANTY" | "BRAND_WARRANTY" | "NO_WARRANTY" {
  const map: Record<
    string,
    "HELLOFI_WARRANTY" | "BRAND_WARRANTY" | "NO_WARRANTY"
  > = {
    "hellofi warranty": "HELLOFI_WARRANTY",
    "brand warranty": "BRAND_WARRANTY",
    "no warranty": "NO_WARRANTY",
  };
  return map[(value ?? "").toLowerCase()] ?? "NO_WARRANTY";
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log("✅ Connected to MongoDB");

  await prisma.$connect();
  console.log("✅ Connected to PostgreSQL");

  try {
    // ── Preload lookup data ──
    console.log("Preloading lookup data into memory...");

    const allBrands = await prisma.brand.findMany();
    const allCategories = await prisma.category.findMany();
    const allExistingProducts = await prisma.buyingProduct.findMany({
      select: { id: true, slug: true },
    });
    const allInventoryProducts = await prisma.inventoryProduct.findMany({
      select: { id: true, imeiOrSerial: true },
    });

    const brandMap = new Map(allBrands.map((b) => [b.seoName, b]));
    const categoryMapBySeo = new Map(allCategories.map((c) => [c.seoName, c]));
    const categoryMapByName = new Map(allCategories.map((c) => [c.name, c]));
    const existingProductIds = new Set(allExistingProducts.map((p) => p.id));
    const existingSlugs = new Set(allExistingProducts.map((p) => p.slug));
    const inventoryByImei = new Map(
      allInventoryProducts.map((ip) => [ip.imeiOrSerial, ip.id]),
    );

    console.log(
      `Loaded — ${allBrands.length} brands, ${allCategories.length} categories, ${allExistingProducts.length} existing buying products, ${allInventoryProducts.length} inventory products\n`,
    );

    // ═══════════════════════════════════════
    // STEP 1 — Migrate BuyingProduct
    // ═══════════════════════════════════════
    console.log("\n════ STEP 1: Migrating BuyingProduct ════");

    const products = await BuyingProductModel.find({}).lean();
    console.log(`Found ${products.length} products`);

    let productSuccess = 0;
    let productSkipped = 0;
    let productExists = 0;

    for (let i = 0; i < products.length; i += BATCH_SIZE) {
      const batch = products.slice(i, i + BATCH_SIZE);
      const startIndex = i + 1;

      console.log(
        `\n── Product Batch ${Math.ceil((i + 1) / BATCH_SIZE)}: ${startIndex} to ${Math.min(i + BATCH_SIZE, products.length)} ──`,
      );

      for (let j = 0; j < batch.length; j++) {
        const product = batch[j] as any;
        const index = startIndex + j;
        const id = product._id.toString();

        if (existingProductIds.has(id)) {
          console.log(`  [${index}] ⏭️ Already exists: ${product.productName}`);
          productExists++;
          continue;
        }

        if (!product.productName) {
          console.log(`  [${index}] ⚠️ Skipped — no productName`);
          productSkipped++;
          continue;
        }

        const brand = product.brandSeoName
          ? brandMap.get(product.brandSeoName)
          : null;
        const category =
          (product.categorySeoName &&
            categoryMapBySeo.get(product.categorySeoName)) ||
          (product.category && categoryMapByName.get(product.category));

        if (!category) {
          console.log(
            `  [${index}] ⚠️ Skipped — category not found: ${product.productName} (${product.categorySeoName ?? product.category})`,
          );
          productSkipped++;
          continue;
        }

        let slug = product.slug
          ? slugify(product.slug)
          : slugify(product.productName);
        if (existingSlugs.has(slug)) {
          slug = `${slug}-${id.slice(-6)}`;
        }
        existingSlugs.add(slug);

        try {
          await prisma.buyingProduct.create({
            data: {
              id,
              productName: product.productName,
              productSubtitle: product.productSubtitle ?? product.productName,
              slug,
              brandId: brand?.id ?? null,
              manualBrand: !brand && product.brand ? product.brand : null,
              categoryId: category.id,
              isTrending: product.isTrending ?? false,
              // featuredSection, isTopSelling, isGaming, isMegaDhamaka default in schema
            },
          });
          console.log(`  [${index}] ✅ ${product.productName}`);
          productSuccess++;
        } catch (err: any) {
          console.error(
            `  [${index}] ❌ Error: ${product.productName} — ${err.message}`,
          );
          productSkipped++;
        }
      }
    }

    console.log(
      `\nProduct migration — ✅ ${productSuccess} success, ⏭️ ${productExists} exists, ⚠️ ${productSkipped} skipped`,
    );

    // Refresh product id set for FK checks in later steps
    const validProductIds = new Set(
      (await prisma.buyingProduct.findMany({ select: { id: true } })).map(
        (p) => p.id,
      ),
    );

    // ═══════════════════════════════════════
    // STEP 2 — Migrate BuyingVariant
    // ═══════════════════════════════════════
    console.log("\n════ STEP 2: Migrating BuyingVariant ════");

    const variants = await BuyingVariantModel.find({}).lean();
    console.log(`Found ${variants.length} variants`);

    const existingVariantIds = new Set(
      (await prisma.buyingVariant.findMany({ select: { id: true } })).map(
        (v) => v.id,
      ),
    );
    const takenInventoryIds = new Set(
      (
        await prisma.buyingVariant.findMany({
          where: { inventoryProductId: { not: null } },
          select: { inventoryProductId: true },
        })
      ).map((v) => v.inventoryProductId),
    );

    let variantSuccess = 0;
    let variantSkipped = 0;
    let variantExists = 0;

    for (let i = 0; i < variants.length; i += BATCH_SIZE) {
      const batch = variants.slice(i, i + BATCH_SIZE);
      const startIndex = i + 1;

      console.log(
        `\n── Variant Batch ${Math.ceil((i + 1) / BATCH_SIZE)}: ${startIndex} to ${Math.min(i + BATCH_SIZE, variants.length)} ──`,
      );

      for (let j = 0; j < batch.length; j++) {
        const variant = batch[j] as any;
        const index = startIndex + j;
        const id = variant._id.toString();

        if (existingVariantIds.has(id)) {
          console.log(`  [${index}] ⏭️ Already exists: ${variant.sku ?? id}`);
          variantExists++;
          continue;
        }

        const productId = variant.productId?.toString();
        if (!productId || !validProductIds.has(productId)) {
          console.log(
            `  [${index}] ⚠️ Skipped — parent product not found: ${variant.sku ?? id}`,
          );
          variantSkipped++;
          continue;
        }

        if (!variant.sku) {
          console.log(`  [${index}] ⚠️ Skipped — no sku: ${id}`);
          variantSkipped++;
          continue;
        }

        // resolve inventory link via imeiOrSerial, guarding against the unique constraint
        let inventoryProductId: string | null = null;
        if (variant.imeiOrSerial) {
          const matchedId = inventoryByImei.get(variant.imeiOrSerial) ?? null;
          if (matchedId && !takenInventoryIds.has(matchedId)) {
            inventoryProductId = matchedId;
            takenInventoryIds.add(matchedId);
          }
        }

        try {
          await prisma.buyingVariant.create({
            data: {
              id,
              productId,
              sku: variant.sku,
              inventoryProductId,
              variantSubtitle: variant.variantSubtitle ?? "",
              liveLink: variant.liveLink ?? null,
              color: variant.color ?? null,
              colorCode: variant.colorCode ?? null,
              storage: variant.storage ?? null,
              ram: variant.ram ?? null,
              price: variant.price ?? 0,
              mrp: variant.mrp ?? 0,
              emiBasePrice: variant.emiBasePrice ?? null,
              quantity: variant.quantity ?? 0,
              reservedQuantity: variant.reservedQuantity ?? 0,
              productSpec: variant.productSpec ?? null,
              condition: mapCondition(variant.condition),
              availability: mapAvailability(variant.availability),
              screenSize: variant.screenSize ?? null,
              os: mapOS(variant.os),
              processor: variant.processor ?? null,
              batteryCapacity: variant.batteryCapacity ?? null,
              warrantyType: mapWarrantyType(variant.warrantyType),
              warrantyDescription: variant.warrantyDescription ?? null,
              whatsInTheBox: variant.whatsInTheBox ?? [],
              whatsExtra: variant.whatsExtra ?? null,
            },
          });
          console.log(`  [${index}] ✅ ${variant.sku}`);
          variantSuccess++;
        } catch (err: any) {
          console.error(
            `  [${index}] ❌ Error: ${variant.sku ?? id} — ${err.message}`,
          );
          variantSkipped++;
        }
      }
    }

    console.log(
      `\nVariant migration — ✅ ${variantSuccess} success, ⏭️ ${variantExists} exists, ⚠️ ${variantSkipped} skipped`,
    );

    const validVariantIds = new Set(
      (await prisma.buyingVariant.findMany({ select: { id: true } })).map(
        (v) => v.id,
      ),
    );

    // ═══════════════════════════════════════
    // STEP 3 — Migrate BuyingSpecification
    // ═══════════════════════════════════════
    console.log("\n════ STEP 3: Migrating BuyingSpecification ════");

    const specs = await BuyingSpecificationModel.find({}).lean();
    console.log(`Found ${specs.length} specifications`);

    const existingSpecIds = new Set(
      (await prisma.buyingSpecification.findMany({ select: { id: true } })).map(
        (s) => s.id,
      ),
    );

    let specSuccess = 0;
    let specSkipped = 0;
    let specExists = 0;

    for (let i = 0; i < specs.length; i += BATCH_SIZE) {
      const batch = specs.slice(i, i + BATCH_SIZE);
      const startIndex = i + 1;

      console.log(
        `\n── Spec Batch ${Math.ceil((i + 1) / BATCH_SIZE)}: ${startIndex} to ${Math.min(i + BATCH_SIZE, specs.length)} ──`,
      );

      for (let j = 0; j < batch.length; j++) {
        const spec = batch[j] as any;
        const index = startIndex + j;
        const id = spec._id.toString();

        if (existingSpecIds.has(id)) {
          console.log(`  [${index}] ⏭️ Already exists: ${id}`);
          specExists++;
          continue;
        }

        const productId = spec.productId?.toString();
        if (!productId || !validProductIds.has(productId)) {
          console.log(
            `  [${index}] ⚠️ Skipped — parent product not found: ${id}`,
          );
          specSkipped++;
          continue;
        }

        if (!spec.key || !spec.value) {
          console.log(`  [${index}] ⚠️ Skipped — missing key/value: ${id}`);
          specSkipped++;
          continue;
        }

        try {
          await prisma.buyingSpecification.create({
            data: {
              id,
              productId,
              key: spec.key,
              value: spec.value,
              group: spec.group ?? null,
              sortOrder: spec.sortOrder ?? 0,
            },
          });
          console.log(`  [${index}] ✅ ${spec.key}: ${spec.value}`);
          specSuccess++;
        } catch (err: any) {
          console.error(`  [${index}] ❌ Error: ${id} — ${err.message}`);
          specSkipped++;
        }
      }
    }

    console.log(
      `\nSpecification migration — ✅ ${specSuccess} success, ⏭️ ${specExists} exists, ⚠️ ${specSkipped} skipped`,
    );

    // ═══════════════════════════════════════
    // STEP 4 — Migrate BuyingProductImage
    // ═══════════════════════════════════════
    console.log("\n════ STEP 4: Migrating BuyingProductImage ════");

    const images = await BuyingProductImagesModel.find({}).lean();
    console.log(`Found ${images.length} images`);

    const existingImageIds = new Set(
      (await prisma.buyingProductImage.findMany({ select: { id: true } })).map(
        (im) => im.id,
      ),
    );

    let imageSuccess = 0;
    let imageSkipped = 0;
    let imageExists = 0;

    for (let i = 0; i < images.length; i += BATCH_SIZE) {
      const batch = images.slice(i, i + BATCH_SIZE);
      const startIndex = i + 1;

      console.log(
        `\n── Image Batch ${Math.ceil((i + 1) / BATCH_SIZE)}: ${startIndex} to ${Math.min(i + BATCH_SIZE, images.length)} ──`,
      );

      for (let j = 0; j < batch.length; j++) {
        const image = batch[j] as any;
        const index = startIndex + j;
        const id = image._id.toString();

        if (existingImageIds.has(id)) {
          console.log(`  [${index}] ⏭️ Already exists: ${id}`);
          imageExists++;
          continue;
        }

        const variantId = image.variantId?.toString();
        if (!variantId || !validVariantIds.has(variantId)) {
          console.log(
            `  [${index}] ⚠️ Skipped — parent variant not found: ${id}`,
          );
          imageSkipped++;
          continue;
        }

        try {
          await prisma.buyingProductImage.create({
            data: {
              id,
              variantId,
              xs: image.xs ?? null,
              sm: image.sm ?? null,
              md: image.md ?? null,
              lg: image.lg ?? null,
              alt: image.alt ?? null,
              priority: image.priority ?? 0,
              isDefault: image.isDefault ?? false,
            },
          });
          console.log(`  [${index}] ✅ image ${id}`);
          imageSuccess++;
        } catch (err: any) {
          console.error(`  [${index}] ❌ Error: ${id} — ${err.message}`);
          imageSkipped++;
        }
      }
    }

    console.log(
      `\nImage migration — ✅ ${imageSuccess} success, ⏭️ ${imageExists} exists, ⚠️ ${imageSkipped} skipped`,
    );

    // ═══════════════════════════════════════
    console.log(`\n════════════════════════════════`);
    console.log(`FULL MIGRATION COMPLETE`);
    console.log(
      `Products      — ✅ ${productSuccess}  ⏭️ ${productExists}  ⚠️ ${productSkipped}`,
    );
    console.log(
      `Variants      — ✅ ${variantSuccess}  ⏭️ ${variantExists}  ⚠️ ${variantSkipped}`,
    );
    console.log(
      `Specs         — ✅ ${specSuccess}  ⏭️ ${specExists}  ⚠️ ${specSkipped}`,
    );
    console.log(
      `Images        — ✅ ${imageSuccess}  ⏭️ ${imageExists}  ⚠️ ${imageSkipped}`,
    );
    console.log(`════════════════════════════════`);
  } finally {
    await mongoose.disconnect();
    console.log("✅ MongoDB disconnected");

    await prisma.$disconnect();
    console.log("✅ PostgreSQL disconnected");
  }
}

migrate().catch(console.error);
