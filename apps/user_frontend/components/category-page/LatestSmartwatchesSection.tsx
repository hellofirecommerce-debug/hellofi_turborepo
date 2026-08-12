// components/category-page/LatestSmartwatchesSection.tsx
import { ProductCarousel } from "./ProductCarousel";
import type { Product } from "./ProductCard";
import { calculateDiscount } from "../../lib/utlils/calculateDiscount";
import { toProduct } from "../../lib/types/buying/buyingProduct.types";
import { getMostLovedProducts } from "../../lib/data/buyingProduct.data";

interface Props {
  categorySlug?: string;
}

export async function LatestSmartwatchesSection({
  categorySlug = "smart-watch",
}: Props) {
  const items = await getMostLovedProducts(categorySlug);

  if (!items.length) return null;

  const products: Product[] = items.map((c) =>
    toProduct(c, calculateDiscount(c.mrp, c.price).discountPercent),
  );

  return (
    <ProductCarousel
      title="Latest Smartwatches"
      badgeText="Trending"
      seeAllHref="/buy-used-smartwatches"
      products={products}
    />
  );
}
