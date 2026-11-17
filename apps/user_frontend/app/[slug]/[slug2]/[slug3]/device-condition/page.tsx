import { notFound, redirect } from "next/navigation";
import { getSellingProductBySeoName } from "../../../../../lib/data/sellingProduct.data";
import {
  parseVariantSlug,
  normalizeSize,
} from "../../../../../lib/utlils/sellSlug";
import { SellConditionPage } from "../../../../../components/sell/sell-condition/pages/SellConditionPage";

interface Props {
  params: Promise<{ slug: string; slug2: string; slug3: string }>;
}

async function resolve(brandSlug: string, slug3: string) {
  const parsed = parseVariantSlug(slug3);

  // slug3 carries a ram/storage suffix → a specific variant
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

    return { product: base, variant, needsVariant: false };
  }

  // Plain product slug
  const product = await getSellingProductBySeoName(slug3);
  if (!product || product.brand.seoName !== brandSlug) return null;

  // Product with no variants → synthetic variant, same as the variant page
  if (!product.hasVariants) {
    return {
      product,
      variant: {
        id: product.id,
        ram: product.ram,
        storage: "",
        productPrice: product.productPrice ?? 0,
      },
      needsVariant: false,
    };
  }

  // Product has variants but none was chosen → send back to variant picker
  return { product, variant: null, needsVariant: true };
}

export default async function Page({ params }: Props) {
  const { slug, slug2, slug3 } = await params;
  const result = await resolve(slug2, slug3);

  if (!result) notFound();
  if (result.needsVariant || !result.variant) {
    redirect(`/${slug}/${slug2}/${slug3}`);
  }

  return (
    <SellConditionPage
      categorySlug={slug}
      brandSlug={slug2}
      variantSlug={slug3}
      product={result.product}
      variant={result.variant}
    />
  );
}
