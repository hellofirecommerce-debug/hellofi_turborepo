// components/category-page/seperate-category/TopSellingNonAppleDevices.tsx
import { ProductCarousel } from "../ProductCarousel";
import type { Product } from "../ProductCard";
import { calculateDiscount } from "../../../lib/utlils/calculateDiscount";
import { toProduct } from "../../../lib/types/buying/buyingProduct.types";
import { getTopSellingNonAppleProducts } from "../../../lib/data/buyingProduct.data";

interface CategoryConfig {
  title: string;
  seeAllHref: string;
}

const NON_APPLE_CONFIG: Record<string, CategoryConfig> = {
  "mobile-phone": {
    title: "Buy Top Selling Preowned Android Mobile Phones",
    seeAllHref: "/buy-used-mobile-phones?os=android",
  },
  laptop: {
    title:
      "Buy Used Laptops Online India | Dell, HP, Lenovo, Asus – Preowned, Verified ",
    seeAllHref: "/buy-used-laptops?os=windows",
  },
  tablet: {
    title: "Buy Top Selling Preowned Android Tablets",
    seeAllHref: "/buy-used-tablets?os=android",
  },
  "smart-watch": {
    title: "Buy Top Selling Preowned Samsung Watches",
    seeAllHref: "/buy-used-smartwatches?brand=samsung",
  },
};

interface Props {
  categorySlug?: string;
}

export async function TopSellingNonAppleDevices({ categorySlug }: Props) {
  const items = await getTopSellingNonAppleProducts(categorySlug);

  if (!items.length) return null;

  const config = categorySlug ? NON_APPLE_CONFIG[categorySlug] : undefined;

  const products: Product[] = items.map((c) =>
    toProduct(c, calculateDiscount(c.mrp, c.price).discountPercent),
  );

  return (
    <ProductCarousel
      title={config?.title ?? "Buy Top Selling Preowned Devices"}
      seeAllHref={config?.seeAllHref ?? "/buy-used-gadgets"}
      products={products}
    />
  );
}
