// components/category-page/MostLovedSection.tsx
import { ProductCarousel } from "./ProductCarousel";
import type { Product } from "./ProductCard";
import { calculateDiscount } from "../../lib/utlils/calculateDiscount";
import { toProduct } from "../../lib/types/buying/buyingProduct.types";
import { getMostLovedProducts } from "../../lib/data/buyingProduct.data";

interface Props {
  categorySlug?: string;
}

export async function MostLovedSection({ categorySlug }: Props) {
  const items = await getMostLovedProducts(categorySlug);

  if (!items.length) return null;

  const products: Product[] = items.map((c) =>
    toProduct(c, calculateDiscount(c.mrp, c.price).discountPercent),
  );

  return (
    <ProductCarousel
      title="Most Loved This Week"
      badgeText="Best Sellers"
      seeAllHref="/buy-used-gadgets"
      products={products}
    />
  );
}
