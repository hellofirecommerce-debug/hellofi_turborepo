import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import prisma from "@repo/db";

// ── Mongoose Schemas ──
const VariantSchema = new mongoose.Schema(
  {
    ram: String,
    storage: String,
    productPrice: Number,
    sellingProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "sellingProduct",
    },
    status: { type: String, default: "active" },
  },
  { timestamps: true },
);

const SellingProductSchema = new mongoose.Schema(
  {
    productName: String,
    releasedYear: Number,
    launchedDate: Date,
    series: String,
    sellingSeries: { type: mongoose.Schema.Types.ObjectId, ref: "series" },
    productType: String,
    image: String,
    productBrand: String,
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "mobilebrands" },
    productSeoName: String,
    brandSeoName: String,
    categorySeoName: String,
    categoryName: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "category" },
    productPrice: Number,
    status: { type: String, default: "active" },
    hasVariants: { type: Boolean, default: false },
    isConstantRam: { type: Boolean, default: false },
    ram: String,
    variants: [{ type: mongoose.Schema.Types.ObjectId, ref: "variant" }],
  },
  { timestamps: true },
);

mongoose.model("variant", VariantSchema);
const SellingProduct = mongoose.model("sellingProduct", SellingProductSchema);

const BATCH_SIZE = 10; // ← small batch size

async function migrateProductFast(
  product: any,
  index: number,
  brandMap: Map<string, any>,
  categoryMapBySeo: Map<string, any>,
  categoryMapByName: Map<string, any>,
  seriesMap: Map<string, any>,
  existingSet: Set<string>,
): Promise<"success" | "skipped" | "exists"> {
  if (!product.productSeoName) {
    console.log(`  [${index}] ⚠️ Skipped — no seoName: ${product.productName}`);
    return "skipped";
  }
  if (!product.image || product.image === "undefined") {
    console.log(`  [${index}] ⚠️ Skipped — no image: ${product.productName}`);
    return "skipped";
  }

  if (existingSet.has(product.productSeoName)) {
    console.log(`  [${index}] ⏭️ Already exists: ${product.productName}`);
    return "exists";
  }

  const brand = brandMap.get(product.brandSeoName);
  if (!brand) {
    console.log(
      `  [${index}] ⚠️ Skipped — brand not found: ${product.productName} (${product.brandSeoName})`,
    );
    return "skipped";
  }

  const category =
    categoryMapBySeo.get(product.categorySeoName) ||
    categoryMapByName.get(product.categoryName);
  if (!category) {
    console.log(
      `  [${index}] ⚠️ Skipped — category not found: ${product.productName} (${product.categoryName})`,
    );
    return "skipped";
  }

  const series = product.sellingSeries
    ? seriesMap.get(product.sellingSeries.toString())
    : null;
  if (!series) {
    console.log(
      `  [${index}] ⚠️ Skipped — series not found: ${product.productName}`,
    );
    return "skipped";
  }

  try {
    // ── Create product ──
    const createdProduct = await prisma.sellingProduct.create({
      data: {
        id: product._id.toString(),
        productName: product.productName ?? "",
        productSeoName: product.productSeoName,
        brandId: brand.id,
        categoryId: category.id,
        seriesId: series.id,
        image: product.image,
        releasedYear: product.releasedYear ?? null,
        launchedDate: product.launchedDate ?? null,
        productPrice: product.productPrice ?? null,
        status: product.status === "active" ? "ACTIVE" : "INACTIVE",
        hasVariants: product.hasVariants ?? false,
        isConstantRam: product.isConstantRam ?? false,
        ram: product.isConstantRam ? (product.ram ?? null) : null,
      },
    });

    // ── Create variants SEQUENTIALLY — no parallel connections ──
    if (product.hasVariants && product.variants?.length > 0) {
      for (const variant of product.variants as any[]) {
        await prisma.sellingVariant.create({
          data: {
            id: variant._id.toString(),
            sellingProductId: createdProduct.id,
            ram: product.isConstantRam ? null : (variant.ram ?? null),
            storage: variant.storage ?? "",
            productPrice: variant.productPrice ?? 0,
            status: variant.status === "active" ? "ACTIVE" : "INACTIVE",
          },
        });
      }
      console.log(
        `  [${index}] ✅ ${product.productName} (${product.variants.length} variants)`,
      );
    } else {
      console.log(`  [${index}] ✅ ${product.productName}`);
    }

    return "success";
  } catch (err: any) {
    console.error(
      `  [${index}] ❌ Error: ${product.productName} — ${err.message}`,
    );
    return "skipped";
  }
}

async function migrate() {
  // ── Single MongoDB connection ──
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log("✅ Connected to MongoDB");

  // ── Single Prisma connection ──
  await prisma.$connect();
  console.log("✅ Connected to PostgreSQL");

  try {
    const products = await SellingProduct.find({}).populate("variants");
    console.log(`Found ${products.length} products`);

    console.log("Preloading lookup data into memory...");

    const allBrands = await prisma.brand.findMany();
    const allCategories = await prisma.category.findMany();
    const allSeries = await prisma.series.findMany();
    const allExisting = await prisma.sellingProduct.findMany({
      select: { productSeoName: true },
    });

    const brandMap = new Map(allBrands.map((b) => [b.seoName, b]));
    const categoryMapBySeo = new Map(allCategories.map((c) => [c.seoName, c]));
    const categoryMapByName = new Map(allCategories.map((c) => [c.name, c]));
    const seriesMap = new Map(allSeries.map((s) => [s.id, s]));
    const existingSet = new Set(allExisting.map((p) => p.productSeoName));

    console.log(
      `Loaded — ${allBrands.length} brands, ${allCategories.length} categories, ${allSeries.length} series, ${allExisting.length} existing products\n`,
    );

    let success = 0;
    let skipped = 0;
    let exists = 0;

    // ── Process batches SEQUENTIALLY — one batch at a time ──
    for (let i = 0; i < products.length; i += BATCH_SIZE) {
      const batch = products.slice(i, i + BATCH_SIZE);
      const startIndex = i + 1;

      console.log(
        `\n── Batch ${Math.ceil((i + 1) / BATCH_SIZE)}: products ${startIndex} to ${Math.min(i + BATCH_SIZE, products.length)} ──`,
      );

      // ← sequential — one product at a time within each batch
      for (let j = 0; j < batch.length; j++) {
        const result = await migrateProductFast(
          batch[j],
          startIndex + j,
          brandMap,
          categoryMapBySeo,
          categoryMapByName,
          seriesMap,
          existingSet,
        );

        if (result === "success") success++;
        else if (result === "exists") exists++;
        else skipped++;
      }

      console.log(
        `Batch complete — ✅ ${success} success, ⏭️ ${exists} exists, ⚠️ ${skipped} skipped`,
      );
    }

    console.log(`\n════════════════════════════════`);
    console.log(`Migration complete`);
    console.log(`✅ Success : ${success}`);
    console.log(`⏭️  Exists  : ${exists}`);
    console.log(`⚠️  Skipped : ${skipped}`);
    console.log(`Total     : ${success + exists + skipped}`);
    console.log(`════════════════════════════════`);
  } finally {
    // ── Always disconnect both ──
    await mongoose.disconnect();
    console.log("✅ MongoDB disconnected");

    await prisma.$disconnect();
    console.log("✅ PostgreSQL disconnected");
  }
}

migrate().catch(console.error);
