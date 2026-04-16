import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import prisma from "@repo/db";

const seriesSchema = new mongoose.Schema(
  {
    brandName: String,
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "mobilebrands" },
    brandSeoName: String,
    categoryName: String,
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "category" },
    categorySeoName: String,
    seriesName: String,
    status: { type: String, default: "active" },
    priority: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Series = mongoose.model("series", seriesSchema);

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log("Connected to MongoDB");

  const seriesList = await Series.find({});
  console.log(`Found ${seriesList.length} series`);

  let success = 0;
  let skipped = 0;

  for (const series of seriesList) {
    try {
      // ── Find brand by seoName ──
      const brand = await prisma.brand.findUnique({
        where: { seoName: series.brandSeoName ?? "" },
      });

      if (!brand) {
        console.log(`⚠️ Brand not found: ${series.brandSeoName} — skipping`);
        skipped++;
        continue;
      }

      // ── Find category by seoName ──
      // ── Find category — try seoName first, fallback to name ──
      let category = null;

      if (series.categorySeoName && series.categorySeoName.trim() !== "") {
        category = await prisma.category.findUnique({
          where: { seoName: series.categorySeoName },
        });
      }

      // ── Fallback to categoryName ──
      if (!category && series.categoryName) {
        category = await prisma.category.findFirst({
          where: { name: series.categoryName },
        });
      }

      if (!category) {
        console.log(`⚠️ Category not found: ${series.categoryName} — skipping`);
        skipped++;
        continue;
      }
      await prisma.series.upsert({
        where: { id: series._id.toString() },
        update: {},
        create: {
          id: series._id.toString(),
          seriesName: series.seriesName ?? "",
          brandId: brand.id,
          categoryId: category.id,
          status: series.status === "active" ? "ACTIVE" : "INACTIVE",
          priority: series.priority ?? 0,
        },
      });

      success++;
      console.log(`✅ Series migrated: ${series.seriesName}`);
    } catch (err) {
      console.error(`❌ Error migrating series ${series.seriesName}:`, err);
    }
  }

  console.log(`\nMigration complete — ${success} success, ${skipped} skipped`);
  await mongoose.disconnect();
}

migrate().catch(console.error);
