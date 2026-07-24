// components/category-page/mobile/TopSellingIphonesSection.tsx
import { ProductCarousel } from "../../ProductCarousel";
import type { Product } from "../../ProductCard";

const TOP_SELLING_IPHONES: Product[] = [
  {
    id: "1",
    brand: "Apple",
    name: "iPhone 14th Pro",
    storage: "128GB",
    condition: "Good",
    price: 79999,
    originalPrice: 134999,
    discountPercent: 41,
    emiFrom: 1500,
  },
  {
    id: "2",
    brand: "Apple",
    name: "iPhone 14th Pro",
    storage: "128GB",
    condition: "Good",
    price: 79999,
    originalPrice: 134999,
    discountPercent: 41,
    emiFrom: 1500,
  },
  {
    id: "3",
    brand: "Apple",
    name: "iPhone 14th Pro",
    storage: "128GB",
    condition: "Good",
    price: 79999,
    originalPrice: 134999,
    discountPercent: 41,
    emiFrom: 1500,
  },
  {
    id: "4",
    brand: "Apple",
    name: "iPhone 14th Pro",
    storage: "128GB",
    condition: "Good",
    price: 79999,
    originalPrice: 134999,
    discountPercent: 41,
    emiFrom: 1500,
  },
  {
    id: "5",
    brand: "Apple",
    name: "iPhone 14 Plus",
    storage: "128GB",
    condition: "Good",
    price: 48999,
    originalPrice: 89999,
    discountPercent: 45,
    emiFrom: 2000,
    badge: "Just In",
  },
  {
    id: "6",
    brand: "Apple",
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

export function TopSellingIphonesSection() {
  return (
    <ProductCarousel
      title="Buy Top Selling Preowned iPhones"
      seeAllHref="/buy-used-mobile-phones?os=ios"
      products={TOP_SELLING_IPHONES}
    />
  );
}
