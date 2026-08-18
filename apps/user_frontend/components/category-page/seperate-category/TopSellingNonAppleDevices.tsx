// components/category-page/seperate-category/TopSellingNonAppleDevices.tsx
import { ProductCarousel } from "../ProductCarousel";
import type { Product } from "../ProductCard";
import { calculateDiscount } from "../../../lib/utlils/calculateDiscount";
import { toProduct } from "../../../lib/types/buying/buyingProduct.types";
import { getTopSellingNonAppleProducts } from "../../../lib/data/buyingProduct.data";

interface Props {
  categorySlug?: string;
}

export async function TopSellingNonAppleDevices({ categorySlug }: Props) {
  const items = await getTopSellingNonAppleProducts(categorySlug);

  if (!items.length) return null;

  const products: Product[] = items.map((c) =>
    toProduct(c, calculateDiscount(c.mrp, c.price).discountPercent),
  );

  return (
    <ProductCarousel
      title="Buy Top Selling Preowned Android"
      seeAllHref="/buy-used-mobile-phones?os=android"
      products={products}
    />
  );
}
