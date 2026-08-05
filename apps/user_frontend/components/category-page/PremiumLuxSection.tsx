// components/category-page/PremiumLuxSection.tsx
"use client";
import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { ProductCarousel } from "./ProductCarousel";
import type { Product } from "./ProductCard";
import { GET_BUYING_PRODUCTS_BY_SECTION } from "../../lib/graphql/queires/buyingProduct.queries";
import { calculateDiscount } from "../../lib/utlils/calculateDiscount";

import {
  toProduct,
  type GetBuyingProductsBySectionData,
  type GetBuyingProductsBySectionVars,
} from "../../lib/types/buying/buyingProduct.types";

const TAGS = [
  "Save up to 30%",
  "Like New Condition",
  "24 Hours Support",
  "24 Hours Support",
  "24 Hours Support",
];

export function PremiumLuxSection() {
  const { data, loading } = useQuery<
    GetBuyingProductsBySectionData,
    GetBuyingProductsBySectionVars
  >(GET_BUYING_PRODUCTS_BY_SECTION, {
    variables: { section: "LUXE" },
  });

  if (loading || !data?.getBuyingProductsBySection?.length) return null;

  const products: Product[] = data.getBuyingProductsBySection.map((c) =>
    toProduct(c, calculateDiscount(c.mrp, c.price).discountPercent),
  );

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
              HelloFi Luxe
            </h2>
          </div>

          <Link
            href="/premium"
            className="shrink-0 hidden sm:inline-block bg-white text-black text-xs sm:text-sm font-bold rounded-full px-5 sm:px-6 py-2 sm:py-2.5 hover:bg-gray-100 transition-colors whitespace-nowrap"
            style={{
              backgroundImage:
                "linear-gradient(120deg, #e8dfc9 1.67%, #f0cf8f 30.32%, #d7ba86 93.87%)",
            }}
          >
            Browse Premium
          </Link>
        </div>

        {/* mobile browse button */}

        {/* product carousel — dark variant, real Luxe products */}
        <ProductCarousel
          title="Premium Picks"
          // badgeText="HelloFi Lux"
          seeAllHref="/premium"
          products={products}
          variant="dark"
        />

        <Link
          href="/premium"
          style={{
            backgroundImage:
              "linear-gradient(120deg, #e8dfc9 1.67%, #f0cf8f 30.32%, #d7ba86 93.87%)",
          }}
          className="sm:hidden mt-4 block text-center bg-white text-black text-xs font-bold rounded-full px-5 py-2.5 mb-6"
        >
          Browse Premium
        </Link>

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
