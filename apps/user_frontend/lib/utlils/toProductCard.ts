// lib/utils/toProductCard.ts
import type { BuyingProductCard } from "../types/buying/buyingProduct.types";
import type { Product } from "../../components/category-page/ProductCard";
import { calculateDiscount } from "./calculateDiscount";

const CONDITION_LABELS: Record<string, string> = {
  UNBOXED: "Unboxed",
  SUPERB: "Like New",
  GOOD: "Good",
  FAIR: "Fair",
  PARTIALLY_FAIR: "Fair",
  BRAND_NEW_UNACTIVATED: "Brand New (Unactivated)",
};

const WARRANTY_LABELS: Record<string, string> = {
  HELLOFI_WARRANTY: "Seller Warranty",
  BRAND_WARRANTY: "Brand Warranty",
  NO_WARRANTY: "",
};

export function toProductCard(c: BuyingProductCard): Product {
  const { discountPercent } = calculateDiscount(c.mrp, c.price);
  const badgeLabel = WARRANTY_LABELS[c.warrantyType];

  const badge: Product["badge"] =
    badgeLabel === "Brand Warranty" || badgeLabel === "Seller Warranty"
      ? badgeLabel
      : undefined;

  return {
    id: c.id,
    brand: c.brand?.name ?? c.manualBrand ?? "",
    name: c.productName,
    image: c.image?.lg ?? c.image?.md ?? undefined,
    storage: c.storage ?? "",
    condition: CONDITION_LABELS[c.condition] ?? c.condition,
    price: c.price,
    originalPrice: c.mrp,
    discountPercent,
    emiFrom: c.emiBasePrice ?? 0,
    badge,
  };
}
