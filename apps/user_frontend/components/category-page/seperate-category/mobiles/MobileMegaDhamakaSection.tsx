// components/category-page/mobile/MobileMegaDhamakaSection.tsx
import { MegaDhamakaSection } from "../../shared/MegaDhamakaSection";
import type { Product } from "../../ProductCard";

const MEGA_DHAMAKA_PRODUCTS: Product[] = [
  {
    id: "1",
    brand: "Vivo",
    name: "Vivo V60",
    storage: "256GB",
    condition: "Like New",
    price: 95999,
    originalPrice: 140000,
    discountPercent: 31,
    emiFrom: 3000,
  },
  {
    id: "2",
    brand: "Vivo",
    name: "Vivo V60",
    storage: "128GB",
    condition: "Good",
    price: 95999,
    originalPrice: 140000,
    discountPercent: 31,
    emiFrom: 3000,
  },
];

export function MobileMegaDhamakaSection() {
  return (
    <MegaDhamakaSection
      products={MEGA_DHAMAKA_PRODUCTS}
      endsAt="2026-07-27T23:59:59Z"
      totalUnits={250}
      unitsRemaining={17}
    />
  );
}
