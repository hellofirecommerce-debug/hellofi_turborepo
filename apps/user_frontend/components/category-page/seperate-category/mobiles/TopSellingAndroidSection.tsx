// components/category-page/mobile/TopSellingAndroidSection.tsx
import { ProductCarousel } from "../../ProductCarousel";
import type { Product } from "../../ProductCard";

const TOP_SELLING_ANDROID: Product[] = [
  {
    id: "1",
    brand: "Motorola",
    name: "Motorola Edge 70",
    storage: "256GB",
    condition: "Like New",
    price: 29999,
    originalPrice: 35000,
    discountPercent: 34,
    emiFrom: 1500,
  },
  {
    id: "2",
    brand: "Oppo",
    name: "Oppo Reno 14th Pro",
    storage: "128GB",
    condition: "Good",
    price: 79999,
    originalPrice: 134999,
    discountPercent: 41,
    emiFrom: 1500,
  },
  {
    id: "3",
    brand: "Google",
    name: "Google Pixel 8 Pro",
    storage: "128GB",
    condition: "Good",
    price: 59999,
    originalPrice: 106999,
    discountPercent: 44,
    emiFrom: 1500,
  },
  {
    id: "4",
    brand: "Vivo",
    name: "Vivo V60",
    storage: "128GB",
    condition: "Fair",
    price: 48999,
    originalPrice: 89999,
    discountPercent: 45,
    emiFrom: 2000,
    badge: "Just In",
  },
  {
    id: "5",
    brand: "Vivo",
    name: "Vivo V60",
    storage: "128GB",
    condition: "Fair",
    price: 48999,
    originalPrice: 89999,
    discountPercent: 45,
    emiFrom: 2000,
    badge: "Just In",
  },
  {
    id: "6",
    brand: "Samsung",
    name: "iPhone 14 Plus",
    storage: "128GB",
    condition: "Fair",
    price: 48999,
    originalPrice: 89999,
    discountPercent: 45,
    emiFrom: 2000,
    badge: "Just In",
  },
];

export function TopSellingAndroidSection() {
  return (
    <ProductCarousel
      title="Buy Top Selling Preowned Android"
      seeAllHref="/buy-used-mobile-phones?os=android"
      products={TOP_SELLING_ANDROID}
    />
  );
}
