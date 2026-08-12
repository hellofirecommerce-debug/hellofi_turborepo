// components/category-page/PhonesPeopleLoveSection.tsx
import { ProductCarousel } from "./ProductCarousel";
import type { Product } from "./ProductCard";
import { calculateDiscount } from "../../lib/utlils/calculateDiscount";
import { toProduct } from "../../lib/types/buying/buyingProduct.types";
import { getPeopleLoveProducts } from "../../lib/data/buyingProduct.data";

interface Props {
  categorySlug?: string;
}

export async function PhonesPeopleLoveSection({
  categorySlug = "mobile-phone",
}: Props) {
  const items = await getPeopleLoveProducts(categorySlug);

  if (!items.length) return null;

  const products: Product[] = items.map((c) =>
    toProduct(c, calculateDiscount(c.mrp, c.price).discountPercent),
  );

  return (
    <ProductCarousel
      title="Phones People Are Loving"
      badgeText="Best Sellers"
      seeAllHref="/buy-used-mobile-phones"
      products={products}
    />
  );
}
