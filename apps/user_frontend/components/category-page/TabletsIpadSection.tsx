// components/category-page/TabletsIpadSection.tsx
import { ProductCarousel } from "./ProductCarousel";
import type { Product } from "./ProductCard";
import { calculateDiscount } from "../../lib/utlils/calculateDiscount";
import { toProduct } from "../../lib/types/buying/buyingProduct.types";
import { getMostLovedProducts } from "../../lib/data/buyingProduct.data";

interface Props {
  categorySlug?: string;
}

export async function TabletsIpadSection({ categorySlug = "tablet" }: Props) {
  const items = await getMostLovedProducts(categorySlug);

  if (!items.length) return null;

  const products: Product[] = items.map((c) =>
    toProduct(c, calculateDiscount(c.mrp, c.price).discountPercent),
  );

  return (
    <ProductCarousel
      title="Tablets & iPad"
      badgeText="New Arrivals"
      seeAllHref="/buy-used-tablets"
      products={products}
    />
  );
}
