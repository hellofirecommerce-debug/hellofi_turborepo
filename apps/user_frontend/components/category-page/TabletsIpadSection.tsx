// components/category-page/TabletsIpadSection.tsx
import { ProductCarousel } from "./ProductCarousel";
import type { Product } from "./ProductCard";

const TABLETS_IPAD: Product[] = [
  {
    id: "1",
    brand: "Apple",
    name: "iPad Pro 12.9",
    image: "https://placehold.co/400x400/e5e5e5/333?text=iPad+Pro+12.9",
    storage: "128GB",
    condition: "Like New",
    price: 72999,
    originalPrice: 109999,
    discountPercent: 34,
    emiFrom: 1500,
  },
  {
    id: "2",
    brand: "Apple",
    name: "iPad Air M1",
    image: "https://placehold.co/400x400/e5e5e5/333?text=iPad+Air+M1",
    storage: "64GB",
    condition: "Good",
    price: 34999,
    originalPrice: 59999,
    discountPercent: 42,
    emiFrom: 1200,
  },
  {
    id: "3",
    brand: "Samsung",
    name: "Samsung Galaxy Tab S9",
    image: "https://placehold.co/400x400/e5e5e5/333?text=Galaxy+Tab+S9",
    storage: "128GB",
    condition: "Good",
    price: 44999,
    originalPrice: 79999,
    discountPercent: 44,
    emiFrom: 1200,
  },
  {
    id: "4",
    brand: "Apple",
    name: "iPad Mini 6th Gen",
    image: "https://placehold.co/400x400/e5e5e5/333?text=iPad+Mini+6",
    storage: "64GB",
    condition: "Like New",
    price: 27999,
    originalPrice: 49999,
    discountPercent: 44,
    emiFrom: 1000,
  },
  {
    id: "5",
    brand: "Microsoft",
    name: "Microsoft Surface Pro 9",
    image: "https://placehold.co/400x400/e5e5e5/333?text=Surface+Pro+9",
    storage: "256GB",
    condition: "Good",
    price: 84999,
    originalPrice: 129999,
    discountPercent: 35,
    emiFrom: 1800,
    badge: "Just In",
  },
  {
    id: "6",
    brand: "Microsoft",
    name: "Microsoft Surface Pro 8",
    image: "https://placehold.co/400x400/e5e5e5/333?text=Surface+Pro+8",
    storage: "256GB",
    condition: "Good",
    price: 84999,
    originalPrice: 129999,
    discountPercent: 35,
    emiFrom: 1800,
    badge: "Just In",
  },
];

export function TabletsIpadSection() {
  return (
    <ProductCarousel
      title="Tablets & iPad"
      badgeText="New Arrivals"
      seeAllHref="/buy-used-tablets"
      products={TABLETS_IPAD}
    />
  );
}
