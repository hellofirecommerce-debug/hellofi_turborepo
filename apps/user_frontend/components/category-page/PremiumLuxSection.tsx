// components/category-page/PremiumLuxSection.tsx
import Link from "next/link";
import { ProductCarousel } from "./ProductCarousel";
import type { Product } from "./ProductCard";

const TAGS = [
  "Save up to 30%",
  "Like New Condition",
  "24 Hours Support",
  "24 Hours Support",
  "24 Hours Support",
];

const PREMIUM_LUX_PRODUCTS: Product[] = [
  {
    id: "1",
    brand: "Apple",
    name: "iPhone 15 Pro Max",
    storage: "256GB",
    condition: "Like New",
    price: 109999,
    originalPrice: 159999,
    discountPercent: 31,
    emiFrom: 2000,
    badge: "Brand Warranty",
  },
  {
    id: "2",
    brand: "Apple",
    name: "MacBook Pro M3",
    storage: "512GB",
    condition: "Like New",
    price: 154999,
    originalPrice: 219999,
    discountPercent: 30,
    emiFrom: 2500,
    badge: "Brand Warranty",
  },
  {
    id: "3",
    brand: "Samsung",
    name: "Galaxy Z Fold 5",
    storage: "256GB",
    condition: "Good",
    price: 99999,
    originalPrice: 154999,
    discountPercent: 36,
    emiFrom: 1800,
    badge: "Seller Warranty",
  },
  {
    id: "4",
    brand: "Apple",
    name: "iPad Pro M2 12.9",
    storage: "256GB",
    condition: "Like New",
    price: 84999,
    originalPrice: 129999,
    discountPercent: 35,
    emiFrom: 1500,
    badge: "Just In",
  },
  {
    id: "5",
    brand: "Apple",
    name: "Apple Watch Ultra 2",
    storage: "49mm",
    condition: "Like New",
    price: 62999,
    originalPrice: 89999,
    discountPercent: 30,
    emiFrom: 1200,
    badge: "Just In",
  },
  {
    id: "6",
    brand: "Sony",
    name: "Sony WH-1000XM5",
    storage: "-",
    condition: "Like New",
    price: 21999,
    originalPrice: 34999,
    discountPercent: 37,
    emiFrom: 900,
  },
];

export function PremiumLuxSection() {
  return (
    <section className="w-full relative overflow-hidden bg-black">
      {/* decorative circle — top left */}
      <div
        className="absolute -top-24 -left-24 sm:-top-32 sm:-left-32 w-64 h-64 sm:w-80 sm:h-80 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: "#D97706", opacity: 0.25 }}
      />
      {/* decorative circle — bottom right */}
      <div
        className="absolute -bottom-24 -right-24 sm:-bottom-32 sm:-right-32 w-64 h-64 sm:w-80 sm:h-80 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: "#D97706", opacity: 0.25 }}
      />

      <div className="relative max-w-7xl mx-auto px-4 py-8 sm:py-10 lg:py-12">
        {/* header */}
        <div className="flex items-start justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <span
                className="w-4 sm:w-5 h-px"
                style={{ backgroundColor: "#D97706" }}
              />
              <span
                className="text-[9px] sm:text-[10px] font-bold tracking-widest uppercase"
                style={{ color: "#D97706" }}
              >
                Premium Pre-Owned
              </span>
            </div>
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(120deg, #e8dfc9 1.67%, #f0cf8f 30.32%, #674e2e 93.87%)",
              }}
            >
              HelloFi Lux
            </h2>
          </div>

          <Link
            href="/premium"
            className="shrink-0 hidden sm:inline-block bg-white text-black text-xs sm:text-sm font-bold rounded-full px-5 sm:px-6 py-2 sm:py-2.5 hover:bg-gray-100 transition-colors whitespace-nowrap"
          >
            Browse Premium
          </Link>
        </div>

        {/* mobile browse button */}
        <Link
          href="/premium"
          className="sm:hidden block text-center bg-white text-black text-xs font-bold rounded-full px-5 py-2.5 mb-6"
        >
          Browse Premium
        </Link>

        {/* product carousel — dark variant, placeholder images (no external image URLs) */}
        <ProductCarousel
          title="Premium Picks"
          badgeText="HelloFi Lux"
          seeAllHref="/premium"
          products={PREMIUM_LUX_PRODUCTS}
          variant="dark"
        />

        {/* tags — centered, below products */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5 mt-8 sm:mt-10">
          {TAGS.map((tag, i) => (
            <span
              key={`${tag}-${i}`}
              className="text-[10px] sm:text-xs font-semibold text-white rounded-full px-3 sm:px-4 py-1.5 sm:py-2 border"
              style={{ borderColor: "#4F46E5" }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
