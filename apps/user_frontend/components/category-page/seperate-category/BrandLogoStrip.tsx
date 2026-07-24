// components/category-page/shared/BrandLogoStrip.tsx
"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface BrandLogo {
  name: string;
}

interface BrandLogoStripProps {
  eyebrow?: string;
  title?: string;
  brands: BrandLogo[];
  seeAllHref?: string;
}

export function BrandLogoStrip({
  eyebrow = "Top Brands",
  title = "Shop by Brand",
  brands,
  seeAllHref,
}: BrandLogoStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    const amount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 w-full">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg lg:text-xl font-bold text-black">
            {title}
          </h2>
          <span className="text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full bg-primary-surface text-primary">
            {eyebrow}
          </span>
        </div>
        {seeAllHref && (
          <Link
            href={seeAllHref}
            className="text-xs sm:text-sm font-medium text-primary hover:underline whitespace-nowrap"
          >
            Browse All →
          </Link>
        )}
      </div>

      <div className="relative">
        {/* left arrow — hidden below 1024px */}
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-11 h-11 items-center justify-center rounded-full bg-white border border-card-border shadow-md hover:bg-primary-surface transition-colors"
        >
          <ChevronLeft size={20} className="text-black" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-1"
        >
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="shrink-0 w-20 h-16 sm:w-24 sm:h-20 rounded-xl p-[1px]"
              style={{
                background: "linear-gradient(135deg, #FF5A1F 0%, #993613 100%)",
              }}
            >
              <div className="w-full h-full rounded-[11px] bg-white flex items-center justify-center px-3">
                <span className="text-xs sm:text-sm font-semibold text-gray-700 truncate">
                  {brand.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* right arrow — hidden below 1024px */}
        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-11 h-11 items-center justify-center rounded-full bg-white border border-card-border shadow-md hover:bg-primary-surface transition-colors"
        >
          <ChevronRight size={20} className="text-black" />
        </button>
      </div>
    </div>
  );
}
