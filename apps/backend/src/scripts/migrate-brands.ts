import mongoose from "mongoose";
import prisma from "@repo/db";
import dotenv from "dotenv";
dotenv.config();

// ── Mongoose Models ──
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

async function migrate() {
  // ── Connect to MongoDB ──
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log("Connected to MongoDB");

  // ── Fetch all brands ──
  const brands = await MobileBrand.find({});
  console.log(`Found ${brands.length} brands`);

  for (const brand of brands) {
    try {
      // ── Create brand in PostgreSQL ──
      const createdBrand = await prisma.brand.upsert({
        where: { seoName: brand.brandSeoName ?? "" },
        update: {},
        create: {
          name: brand.brandName ?? "",
          seoName: brand.brandSeoName ?? "",
          image: brand.brandImage ?? "",
        },
      });

      console.log(`✅ Brand created: ${createdBrand.name}`);

      // ── Create brand categories ──
      for (const cat of brand.categories ?? []) {
        // Find existing category in PostgreSQL by seoName
        const existingCategory = await prisma.category.findUnique({
          where: { seoName: cat.categorySeoName ?? "" },
        });

        if (!existingCategory) {
          console.log(`⚠️ Category not found: ${cat.categorySeoName}`);
          continue;
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
          `  ✅ BrandCategory: ${createdBrand.name} → ${existingCategory.name}`,
        );
      }
    } catch (err) {
      console.error(`❌ Error migrating brand ${brand.brandName}:`, err);
    }
  }

  console.log("Migration complete");
  await mongoose.disconnect();
}

migrate().catch(console.error);
