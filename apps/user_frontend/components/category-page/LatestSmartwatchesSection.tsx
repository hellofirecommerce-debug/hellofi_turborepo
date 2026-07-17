// components/category-page/LatestSmartwatchesSection.tsx
import { ProductCarousel } from "./ProductCarousel";
import type { Product } from "./ProductCard";

const LATEST_SMARTWATCHES: Product[] = [
  {
    id: "1",
    brand: "Apple",
    name: "Apple Watch Ultra 2",
    storage: "49mm",
    condition: "Like New",
    price: 59999,
    originalPrice: 89999,
    discountPercent: 33,
    emiFrom: 1200,
  },
  {
    id: "2",
    brand: "Apple",
    name: "Apple Watch Series 9",
    storage: "45mm",
    condition: "Good",
    price: 26999,
    originalPrice: 45999,
    discountPercent: 41,
    emiFrom: 900,
  },
  {
    id: "3",
    brand: "Samsung",
    name: "Samsung Galaxy Watch 6",
    storage: "44mm",
    condition: "Good",
    price: 17999,
    originalPrice: 31999,
    discountPercent: 44,
    emiFrom: 700,
  },
  {
    id: "4",
    brand: "Samsung",
    name: "Samsung Galaxy Watch 4",
    storage: "40mm",
    condition: "Fair",
    price: 17999,
    originalPrice: 30999,
    discountPercent: 42,
    emiFrom: 700,
  },
  {
    id: "5",
    brand: "Garmin",
    name: "Garmin Fenix 7 Pro",
    storage: "47mm",
    condition: "Good",
    price: 44999,
    originalPrice: 79999,
    discountPercent: 44,
    emiFrom: 1000,
  },
  {
    id: "6",
    brand: "Apple",
    name: "Apple Watch SE Gen 2",
    storage: "44mm",
    condition: "Good",
    price: 15999,
    originalPrice: 27999,
    discountPercent: 43,
    emiFrom: 600,
    badge: "Just In",
  },
];

export function LatestSmartwatchesSection() {
  return (
    <ProductCarousel
      title="Latest Smartwatches"
      badgeText="Trending"
      seeAllHref="/buy-used-smartwatches"
      products={LATEST_SMARTWATCHES}
    />
  );
}
