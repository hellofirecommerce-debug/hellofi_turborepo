"use client";
import { useQuery } from "@apollo/client/react";
import { ProductCarousel } from "./ProductCarousel";
import type { Product } from "./ProductCard";
import { GET_BUYING_PRODUCTS_BY_SECTION } from "../../lib/graphql/queires/buyingProduct.queries";
import { calculateDiscount } from "../../lib/utlils/calculateDiscount";

const CONDITION_LABELS: Record<string, string> = {
  UNBOXED: "Unboxed",
  SUPERB: "Like New",
  GOOD: "Good",
  FAIR: "Fair",
  PARTIALLY_FAIR: "Fair",
};

const BADGE_BY_WARRANTY: Partial<
  Record<string, NonNullable<Product["badge"]>>
> = {
  BRAND_WARRANTY: "Brand Warranty",
};

interface BuyingProductCard {
  id: string;
  productName: string;
  brand?: { name: string } | null;
  manualBrand?: string | null;
  storage?: string | null;
  condition: string;
  warrantyType: string;
  price: number;
  mrp: number;
  emiBasePrice?: number | null;
  image?: {
    md?: string | null;
    lg?: string | null;
    alt?: string | null;
  } | null;
}

interface GetBuyingProductsBySectionData {
  getBuyingProductsBySection: BuyingProductCard[];
}

interface GetBuyingProductsBySectionVars {
  section: string;
  categorySlug?: string;
}

interface Props {
  categorySlug?: string;
}

export function MostLovedSection({ categorySlug }: Props) {
  const { data, loading } = useQuery<
    GetBuyingProductsBySectionData,
    GetBuyingProductsBySectionVars
  >(GET_BUYING_PRODUCTS_BY_SECTION, {
    variables: { section: "MOST_LOVED", categorySlug },
  });

  if (loading || !data?.getBuyingProductsBySection?.length) return null;

  const products: Product[] = data.getBuyingProductsBySection.map((c) => {
    const { discountPercent } = calculateDiscount(c.mrp, c.price);
    return {
      id: c.id,
      brand: c.brand?.name ?? c.manualBrand ?? "",
      name: c.productName,
      storage: c.storage ?? "",
      condition: CONDITION_LABELS[c.condition] ?? c.condition,
      price: c.price,
      originalPrice: c.mrp,
      discountPercent,
      emiFrom: c.emiBasePrice ?? 0,
      badge: BADGE_BY_WARRANTY[c.warrantyType],
      image: c.image?.lg ?? c.image?.md ?? undefined,
    };
  });

  return (
    <ProductCarousel
      title="Most Loved This Week"
      badgeText="Best Sellers"
      seeAllHref="/buy-used-gadgets"
      products={products}
    />
  );
}
