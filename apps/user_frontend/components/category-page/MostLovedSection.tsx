// components/category-page/MostLovedSection.tsx
import { ProductCarousel } from "./ProductCarousel";
import type { Product } from "./ProductCard";

const MOST_LOVED_PRODUCTS: Product[] = [
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
    badge: "Brand Warranty",
  },
  {
    id: "2",
    brand: "Apple",
    name: "iPad Pro 4th Gen",
    storage: "128GB",
    condition: "Good",
    price: 79999,
    originalPrice: 134000,
    discountPercent: 41,
    emiFrom: 1500,
    badge: "Seller Warranty",
  },
  {
    id: "3",
    brand: "Apple",
    name: "MacBook Air M4",
    storage: "256GB",
    condition: "Like New",
    price: 74999,
    originalPrice: 129999,
    discountPercent: 42,
    emiFrom: 1500,
    badge: "Brand Warranty",
  },
  {
    id: "4",
    brand: "Google",
    name: "Google Pixel 8 Pro",
    storage: "128GB",
    condition: "Good",
    price: 59999,
    originalPrice: 106999,
    discountPercent: 44,
    emiFrom: 1500,
    badge: "Just In",
  },
  {
    id: "5",
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
  {
    id: "6",
    brand: "Samsung",
    name: "Galaxy S20 Ultra",
    storage: "128GB",
    condition: "Fair",
    price: 48999,
    originalPrice: 89999,
    discountPercent: 45,
    emiFrom: 2000,
    badge: "Just In",
  },
];

export function MostLovedSection() {
  return (
    <ProductCarousel
      title="Most Loved This Week"
      badgeText="Best Sellers"
      seeAllHref="/buy-used-gadgets"
      products={MOST_LOVED_PRODUCTS}
    />
  );
}
