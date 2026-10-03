import { notFound } from "next/navigation";
import { getSellingProductBySeoName } from "../../../../lib/data/sellingProduct.data";
import {
  parseVariantSlug,
  normalizeSize,
} from "../../../../lib/utlils/sellSlug";
import { SellProductPage } from "../../../../components/sell/sell-product-pages/pages/SellProductPage";
import { SellVariantPage } from "../../../../components/sell/sell-product-pages/pages/SellVariantPage";

interface Props {
  params: Promise<{ slug: string; slug2: string; slug3: string }>;
}

async function resolve(brandSlug: string, slug3: string) {
  // If slug3 already encodes a ram/storage suffix, it can never be a plain
  // product seoName — skip the wasted fetch-by-slug3 and go straight to the
  // base product via parsed.baseSlug, one backend call instead of two.
  const parsed = parseVariantSlug(slug3);

  if (parsed) {
    const base = await getSellingProductBySeoName(parsed.baseSlug);
    if (!base || base.brand.seoName !== brandSlug) return null;

    const variant = base.variants.find(
      (v: any) =>
        normalizeSize(v.storage) === parsed.storageKey &&
        (parsed.ramKey
          ? normalizeSize(base.isConstantRam ? base.ram : v.ram) ===
            parsed.ramKey
          : !v.ram && !base.isConstantRam),
    );
    if (!variant) return null;

    return { type: "variant" as const, product: base, variant };
  }

  // No ram/storage suffix — slug3 is a plain product seoName.
  const product = await getSellingProductBySeoName(slug3);
  if (!product || product.brand.seoName !== brandSlug) return null;

  return { type: "product" as const, product };
}

export async function generateMetadata({ params }: Props) {
  const { slug2, slug3 } = await params;
  const result = await resolve(slug2, slug3);
  if (!result) return {};
  return {};
}

export default async function Page({ params }: Props) {
  const { slug, slug2, slug3 } = await params;
  const result = await resolve(slug2, slug3);
  if (!result) notFound();

  if (result.type === "variant") {
    return (
      <SellVariantPage
        categorySlug={slug}
        brandSlug={slug2}
        product={result.product}
        variant={result.variant}
      />
    );
  }

  if (!result.product.hasVariants) {
    const syntheticVariant = {
      id: result.product.id,
      ram: result.product.ram,
      storage: "",
      productPrice: result.product.productPrice ?? 0,
    };
    return (
      <SellVariantPage
        categorySlug={slug}
        brandSlug={slug2}
        product={result.product}
        variant={syntheticVariant}
      />
    );
  }

  return (
    <SellProductPage
      categorySlug={slug}
      brandSlug={slug2}
      product={result.product}
    />
  );
}
