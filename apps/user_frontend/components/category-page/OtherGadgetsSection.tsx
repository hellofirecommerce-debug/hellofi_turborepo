// components/category-page/OtherGadgetsSection.tsx
import { ProductCarousel } from "./ProductCarousel";
import type { Product } from "./ProductCard";

const OTHER_GADGETS: Product[] = [
  {
    id: "1",
    brand: "Apple",
    name: "AirPods Pro 2nd Gen",
    storage: "-",
    condition: "Like New",
    price: 14999,
    originalPrice: 24900,
    discountPercent: 40,
    emiFrom: 600,
  },
  {
    id: "2",
    brand: "Sony",
    name: "Sony WH-1000XM5",
    storage: "-",
    condition: "Good",
    price: 17999,
    originalPrice: 29999,
    discountPercent: 40,
    emiFrom: 700,
  },
  {
    id: "3",
    brand: "Canon",
    name: "Canon EOS R50",
    storage: "-",
    condition: "Good",
    price: 59999,
    originalPrice: 89999,
    discountPercent: 33,
    emiFrom: 1200,
  },
  {
    id: "4",
    brand: "GoPro",
    name: "GoPro Hero 12",
    storage: "-",
    condition: "Like New",
    price: 27999,
    originalPrice: 44999,
    discountPercent: 38,
    emiFrom: 900,
  },
  {
    id: "5",
    brand: "GoPro",
    name: "GoPro Hero 12",
    storage: "-",
    condition: "Good",
    price: 27999,
    originalPrice: 44999,
    discountPercent: 38,
    emiFrom: 900,
  },
  {
    id: "6",
    brand: "Apple",
    name: "iPad Pencil 2nd Gen",
    storage: "-",
    condition: "Like New",
    price: 8999,
    originalPrice: 12900,
    discountPercent: 30,
    emiFrom: 400,
    badge: "Just In",
  },
];

export function OtherGadgetsSection() {
  return (
    <ProductCarousel
      title="Other Gadgets & Accessories"
      badgeText="Popular"
      seeAllHref="/buy-used-accessories"
      products={OTHER_GADGETS}
    />
  );
}
