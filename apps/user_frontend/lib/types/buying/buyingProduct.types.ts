export type BuyingProductSection =
  | "TOP_SELLING"
  | "TOP_SELLING_APPLE"
  | "TOP_SELLING_NON_APPLE"
  | "GAMING_LAPTOPS"
  | "TRENDING"
  | "MOST_LOVED"
  | "PEOPLE_LOVE"
  | "MEGA_DHAMAKA"
  | "LUXE";

export interface BuyingProductCard {
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

export interface GetBuyingProductsBySectionData {
  getBuyingProductsBySection: BuyingProductCard[];
}

export interface GetBuyingProductsBySectionVars {
  section: BuyingProductSection;
  categorySlug?: string;
}

// ── Shared display-label maps for enum values coming back from the API ──
export const CONDITION_LABELS: Record<string, string> = {
  UNBOXED: "Unboxed",
  SUPERB: "Like New",
  GOOD: "Good",
  FAIR: "Fair",
  PARTIALLY_FAIR: "Fair",
};

export const WARRANTY_LABELS: Record<string, string> = {
  HELLOFI_WARRANTY: "HelloFi Warranty",
  BRAND_WARRANTY: "Brand Warranty",
  NO_WARRANTY: "No Warranty",
};

// ── Shared mapper: API card shape → the Product shape ProductCard expects ──
import type { Product } from "../../../components/category-page/ProductCard";

export function toProduct(
  c: BuyingProductCard,
  discountPercent: number,
): Product {
  const badgeLabel = WARRANTY_LABELS[c.warrantyType];
  const badge: Product["badge"] =
    badgeLabel === "Brand Warranty" ||
    badgeLabel === "Seller Warranty" ||
    badgeLabel === "Just In"
      ? badgeLabel
      : undefined;

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
    badge,
    image: c.image?.lg ?? c.image?.md ?? undefined,
  };
}
