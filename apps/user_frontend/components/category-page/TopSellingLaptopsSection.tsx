// components/category-page/TopSellingLaptopsSection.tsx
import { ProductCarousel } from "./ProductCarousel";
import type { Product } from "./ProductCard";
import { calculateDiscount } from "../../lib/utlils/calculateDiscount";
import { toProduct } from "../../lib/types/buying/buyingProduct.types";
import { getTopSellingProducts } from "../../lib/data/buyingProduct.data";

interface Props {
  categorySlug?: string;
}

export async function TopSellingLaptopsSection({
  categorySlug = "laptop",
}: Props) {
  const items = await getTopSellingProducts(categorySlug);

  if (!items.length) return null;

  const products: Product[] = items.map((c) =>
    toProduct(c, calculateDiscount(c.mrp, c.price).discountPercent),
  );

  return (
    <ProductCarousel
      title="Top Selling Laptops"
      badgeText="Hot Deals"
      seeAllHref="/buy-used-laptops"
      products={products}
    />
  );
}
