// components/category-page/seperate-category/TopSellingAppleDevices.tsx
import { ProductCarousel } from "../ProductCarousel";
import type { Product } from "../ProductCard";
import { calculateDiscount } from "../../../lib/utlils/calculateDiscount";
import { toProduct } from "../../../lib/types/buying/buyingProduct.types";
import { getTopSellingAppleProducts } from "../../../lib/data/buyingProduct.data";

interface Props {
  categorySlug?: string;
}

export async function TopSellingAppleDevices({ categorySlug }: Props) {
  const items = await getTopSellingAppleProducts(categorySlug);

  if (!items.length) return null;

  const products: Product[] = items.map((c) =>
    toProduct(c, calculateDiscount(c.mrp, c.price).discountPercent),
  );

  return (
    <ProductCarousel
      title="Buy Top Selling Preowned iPhones"
      seeAllHref="/buy-used-mobile-phones?os=ios"
      products={products}
    />
  );
}
