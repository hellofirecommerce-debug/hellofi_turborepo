import mongoose from "mongoose";
import prisma from "@repo/db";
import dotenv from "dotenv";
dotenv.config();

const mobileBrandSchema = new mongoose.Schema(
  {
    brandName: String,
    brandSeoName: String,
    brandImage: String,
    categories: [
      {
        categoryId: mongoose.Schema.Types.ObjectId,
        categoryName: String,
        categorySeoName: String,
        priority: { type: Number, default: 0 },
      },
    ],
    status: String,
  },
  { timestamps: true },
);

const MobileBrand = mongoose.model("mobileBrand", mobileBrandSchema);

const BATCH_SIZE = 50;

async function migrateBrand(
  brand: any,
  index: number,
  categoryMapBySeo: Map<string, any>,
  existingBrandSet: Set<string>,
): Promise<"success" | "exists" | "skipped"> {
  if (!brand.brandSeoName) {
    console.log(`  [${index}] ⚠️ Skipped — no seoName: ${brand.brandName}`);
    return "skipped";
  }

  // ── Skip if already exists ──
  if (existingBrandSet.has(brand.brandSeoName)) {
    console.log(`  [${index}] ⏭️ Already exists: ${brand.brandName}`);
    return "exists";
  }

  try {
    // ── Create brand ──
    const createdBrand = await prisma.brand.create({
      data: {
        name: brand.brandName ?? "",
        seoName: brand.brandSeoName ?? "",
        image: brand.brandImage ?? "",
      },
    });

    console.log(`  [${index}] ✅ Brand created: ${createdBrand.name}`);

    // ── Create brand categories in parallel ──
    if (brand.categories?.length > 0) {
      await Promise.all(
        brand.categories.map(async (cat: any) => {
          const existingCategory = categoryMapBySeo.get(
            cat.categorySeoName ?? "",
          );
          if (!existingCategory) {
            console.log(
              `  [${index}]   ⚠️ Category not found: ${cat.categorySeoName}`,
            );
            return;
          }

          await prisma.brandCategory.upsert({
            where: {
              brandId_categoryId: {
                brandId: createdBrand.id,
                categoryId: existingCategory.id,
              },
            },
            update: {},
            create: {
              brandId: createdBrand.id,
              categoryId: existingCategory.id,
              priority: cat.priority ?? 0,
              status: "ACTIVE",
            },
          });

          console.log(
            `  [${index}]   ✅ ${createdBrand.name} → ${existingCategory.name}`,
          );
        }),
      );
    }

    return "success";
  } catch (err: any) {
    console.error(`  [${index}] ❌ Error: ${brand.brandName} — ${err.message}`);
    return "skipped";
  }
}

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log("✅ Connected to MongoDB");

  const brands = await MobileBrand.find({});
  console.log(`Found ${brands.length} brands`);

  // ── Preload all categories and existing brands into memory ──
  console.log("Preloading lookup data...");

  const allCategories = await prisma.category.findMany();
  const allExistingBrands = await prisma.brand.findMany({
    select: { seoName: true },
  });

  const categoryMapBySeo = new Map(allCategories.map((c) => [c.seoName, c]));
  const existingBrandSet = new Set(allExistingBrands.map((b) => b.seoName));

  console.log(
    `Loaded — ${allCategories.length} categories, ${allExistingBrands.length} existing brands\n`,
  );

  let success = 0;
  let skipped = 0;
  let exists = 0;

  // ── Batch processing ──
  for (let i = 0; i < brands.length; i += BATCH_SIZE) {
    const batch = brands.slice(i, i + BATCH_SIZE);
    const startIndex = i + 1;

    console.log(
      `\n── Batch ${Math.ceil((i + 1) / BATCH_SIZE)}: brands ${startIndex} to ${Math.min(i + BATCH_SIZE, brands.length)} ──`,
    );

    const results = await Promise.all(
      batch.map((brand, batchIndex) =>
        migrateBrand(
          brand,
          startIndex + batchIndex,
          categoryMapBySeo,
          existingBrandSet,
        ),
      ),
    );

    results.forEach((r) => {
      if (r === "success") success++;
      else if (r === "exists") exists++;
      else skipped++;
    });

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

  await mongoose.disconnect();
}

migrate().catch(console.error);
