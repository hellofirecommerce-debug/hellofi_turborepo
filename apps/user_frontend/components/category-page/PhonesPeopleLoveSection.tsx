// components/category-page/PhonesPeopleLoveSection.tsx
import { ProductCarousel } from "./ProductCarousel";
import type { Product } from "./ProductCard";

const PHONES_PEOPLE_LOVE: Product[] = [
  {
    id: "1",
    brand: "Apple",
    name: "iPhone 15 Pro Max",
    image: "https://placehold.co/400x400/e5e5e5/333?text=15+Pro+Max",
    storage: "256GB",
    condition: "Like New",
    price: 104999,
    originalPrice: 159999,
    discountPercent: 34,
    emiFrom: 1500,
  },
  {
    id: "2",
    brand: "Apple",
    name: "iPhone 15 Pro",
    image: "https://placehold.co/400x400/e5e5e5/333?text=15+Pro",
    storage: "128GB",
    condition: "Good",
    price: 79999,
    originalPrice: 134999,
    discountPercent: 41,
    emiFrom: 1500,
  },
  {
    id: "3",
    brand: "Samsung",
    name: "Samsung Galaxy S24 Ultra",
    image: "https://placehold.co/400x400/e5e5e5/333?text=S24+Ultra",
    storage: "256GB",
    condition: "Like New",
    price: 74999,
    originalPrice: 129999,
    discountPercent: 42,
    emiFrom: 1500,
  },
  {
    id: "4",
    brand: "Google",
    name: "Google Pixel 8 Pro",
    image: "https://placehold.co/400x400/e5e5e5/333?text=Pixel+8+Pro",
    storage: "128GB",
    condition: "Good",
    price: 59999,
    originalPrice: 106999,
    discountPercent: 44,
    emiFrom: 1500,
  },
  {
    id: "5",
    brand: "Apple",
    name: "iPhone 14 Plus",
    image: "https://placehold.co/400x400/e5e5e5/333?text=iPhone+14+Plus",
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
    name: "Galaxy S24 Ultra",
    image: "https://placehold.co/400x400/e5e5e5/333?text=S24+Ultra",
    storage: "128GB",
    condition: "Fair",
    price: 48999,
    originalPrice: 89999,
    discountPercent: 45,
    emiFrom: 2000,
    badge: "Just In",
  },
];

export function PhonesPeopleLoveSection() {
  return (
    <ProductCarousel
      title="Phones People Are Loving"
      badgeText="Best Sellers"
      seeAllHref="/buy-used-mobile-phones"
      products={PHONES_PEOPLE_LOVE}
    />
  );
}
