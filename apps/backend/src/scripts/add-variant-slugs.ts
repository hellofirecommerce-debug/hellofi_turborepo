// scripts/add-variant-slugs.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function splitUnitValue(value: string | null | undefined): string[] {
  if (!value) return [];
  const cleaned = value.trim().toLowerCase().replace(/\s+/g, "");
  if (!cleaned) return [];

  const match = cleaned.match(/^(\d+(?:\.\d+)?)(gb|tb|mb|kb)$/);
  if (match) {
    const num = match[1];
    const unit = match[2];
    if (num && unit) return [num, unit];
  }

  const fallback = cleaned.match(/^(\d+(?:\.\d+)?)([a-z]+)$/);
  if (fallback) {
    const num = fallback[1];
    const unit = fallback[2];
    if (num && unit) return [num, unit];
  }

  return [cleaned];
}

function slugifyPart(value: string | null | undefined): string {
  if (!value) return "";
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildVariantSlug(
  productSeoName: string,
  productRam: string | null,
  isConstantRam: boolean,
  variantRam: string | null,
  storage: string,
): string {
  const ram = isConstantRam ? productRam : variantRam;
  const parts: string[] = [slugifyPart(productSeoName)];
  parts.push(...splitUnitValue(ram));
  parts.push(...splitUnitValue(storage));
  return parts.filter(Boolean).join("-");
}

async function main() {
  console.log("🚀 Starting variant slug migration...\n");

  const products = await prisma.sellingProduct.findMany({
    select: {
      id: true,
      productName: true,
      productSeoName: true,
      ram: true,
      isConstantRam: true,
      hasVariants: true,
      variants: {
        select: { id: true, ram: true, storage: true, slug: true },
      },
    },
  });

  console.log(`Found ${products.length} products\n`);

  const existingSlugs = new Set(
    (await prisma.sellingVariant.findMany({ select: { slug: true } }))
      .map((v) => v.slug)
      .filter((s): s is string => !!s),
  );

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const product of products) {
    console.log(
      `\n📦 ${product.productName} (${product.variants.length} variants)`,
    );

    for (const variant of product.variants) {
      if (variant.slug) {
        console.log(`  ⏭️  Already has slug: ${variant.slug}`);
        skipped++;
        continue;
      }

      try {
        const baseSlug = buildVariantSlug(
          product.productSeoName,
          product.ram,
          product.isConstantRam,
          variant.ram,
          variant.storage,
        );

        if (!baseSlug) {
          console.log(`  ⚠️  Could not build slug for variant ${variant.id}`);
          skipped++;
          continue;
        }

        let finalSlug = baseSlug;
        let counter = 1;
        while (existingSlugs.has(finalSlug)) {
          counter++;
          finalSlug = `${baseSlug}-${counter}`;
        }

        await prisma.sellingVariant.update({
          where: { id: variant.id },
          data: { slug: finalSlug },
        });

        existingSlugs.add(finalSlug);
        console.log(`  ✅ ${variant.id} → ${finalSlug}`);
        updated++;
      } catch (err: any) {
        console.error(`  ❌ Failed ${variant.id}: ${err.message}`);
        failed++;
      }
    }
  }

  console.log(`\n════════════════════════════════`);
  console.log(`✅ Updated : ${updated}`);
  console.log(`⏭️  Skipped : ${skipped}`);
  console.log(`❌ Failed  : ${failed}`);
  console.log(`════════════════════════════════`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
