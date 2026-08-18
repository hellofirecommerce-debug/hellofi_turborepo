// components/category-page/seperate-category/CategoryMegaDhamakaSection.tsx
import { MegaDhamakaSection } from "../shared/MegaDhamakaSection";
import type { Product } from "../ProductCard";
import { calculateDiscount } from "../../../lib/utlils/calculateDiscount";
import { toProduct } from "../../../lib/types/buying/buyingProduct.types";
import { getMegaDhamakaProducts } from "../../../lib/data/buyingProduct.data";

interface Props {
  categorySlug?: string;
}

export async function CategoryMegaDhamakaSection({ categorySlug }: Props) {
  const items = await getMegaDhamakaProducts(categorySlug);

  if (!items.length) return null;

  const products: Product[] = items.map((c) =>
    toProduct(c, calculateDiscount(c.mrp, c.price).discountPercent),
  );

  return (
    <MegaDhamakaSection
      products={products}
      endsAt="2026-07-27T23:59:59Z"
      totalUnits={250}
      unitsRemaining={17}
    />
  );
}
