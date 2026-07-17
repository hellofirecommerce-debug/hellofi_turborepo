// components/category-page/TopSellingLaptopsSection.tsx
import { ProductCarousel } from "./ProductCarousel";
import type { Product } from "./ProductCard";

const TOP_SELLING_LAPTOPS: Product[] = [
  {
    id: "1",
    brand: "Apple",
    name: "MacBook Air M2",
    storage: "256GB SSD",
    condition: "Like New",
    price: 78999,
    originalPrice: 114900,
    discountPercent: 31,
    emiFrom: 1500,
  },
  {
    id: "2",
    brand: "Apple",
    name: "Dell XPS 15",
    storage: "512GB SSD",
    condition: "Good",
    price: 82999,
    originalPrice: 149999,
    discountPercent: 44,
    emiFrom: 1500,
  },
  {
    id: "3",
    brand: "Apple",
    name: "MacBook Pro M3",
    storage: "512GB SSD",
    condition: "Like New",
    price: 144999,
    originalPrice: 199999,
    discountPercent: 27,
    emiFrom: 1500,
  },
  {
    id: "4",
    brand: "Apple",
    name: "HP Spectre x360",
    storage: "256GB SSD",
    condition: "Good",
    price: 69999,
    originalPrice: 124999,
    discountPercent: 44,
    emiFrom: 1500,
  },
  {
    id: "5",
    brand: "Apple",
    name: "Lenovo ThinkPad X1",
    storage: "512GB SSD",
    condition: "Good",
    price: 72999,
    originalPrice: 139999,
    discountPercent: 47,
    emiFrom: 1500,
    badge: "Just In",
  },
  {
    id: "6",
    brand: "Apple",
    name: "Lenovo ThinkPad X1",
    storage: "512GB SSD",
    condition: "Good",
    price: 72999,
    originalPrice: 139999,
    discountPercent: 47,
    emiFrom: 1500,
    badge: "Just In",
  },
];

export function TopSellingLaptopsSection() {
  return (
    <ProductCarousel
      title="Top Selling Laptops"
      badgeText="Hot Deals"
      seeAllHref="/buy-used-laptops"
      products={TOP_SELLING_LAPTOPS}
    />
  );
}
