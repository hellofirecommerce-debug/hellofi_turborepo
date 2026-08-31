// components/category-page/seperate-category/TopSellingAppleDevices.tsx
import { ProductCarousel } from "../ProductCarousel";
import type { Product } from "../ProductCard";
import { calculateDiscount } from "../../../lib/utlils/calculateDiscount";
import { toProduct } from "../../../lib/types/buying/buyingProduct.types";
import { getTopSellingAppleProducts } from "../../../lib/data/buyingProduct.data";

interface CategoryConfig {
  title: string;
  seeAllHref: string;
}

const APPLE_CONFIG: Record<string, CategoryConfig> = {
  "mobile-phone": {
    title: "Top Selling Preowned iPhones —Certified, Warranty Included",
    seeAllHref: "/buy-used-mobile-phones?os=ios",
  },
  laptop: {
    title: "Buy Used MacBook Online India | Preowned, Never Refurbished",
    seeAllHref: "/buy-used-laptops?os=macos",
  },
  tablet: {
    title: "Buy Top Selling Preowned iPads",
    seeAllHref: "/buy-used-tablets?os=ios",
  },
  "smart-watch": {
    title: "Buy Top Selling Preowned Apple Watches",
    seeAllHref: "/buy-used-smartwatches?brand=apple",
  },
};

interface Props {
  categorySlug?: string;
}

export async function TopSellingAppleDevices({ categorySlug }: Props) {
  const items = await getTopSellingAppleProducts(categorySlug);

  if (!items.length) return null;

  const config = categorySlug ? APPLE_CONFIG[categorySlug] : undefined;

  const products: Product[] = items.map((c) =>
    toProduct(c, calculateDiscount(c.mrp, c.price).discountPercent),
  );

  return (
    <ProductCarousel
      title={config?.title ?? "Buy Top Selling Preowned Apple Devices"}
      seeAllHref={config?.seeAllHref ?? "/buy-used-gadgets"}
      products={products}
    />
  );
}
