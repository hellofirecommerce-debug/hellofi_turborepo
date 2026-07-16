"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard, type Product } from "./ProductCard";

interface ProductCarouselProps {
  title: string;
  badgeText?: string;
  seeAllHref?: string;
  products: Product[];
}

export function ProductCarousel({
  title,
  badgeText,
  seeAllHref = "#",
  products,
}: ProductCarouselProps) {
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
    <section className="w-full">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg lg:text-xl font-bold text-black">
            {title}
          </h2>
          {badgeText && (
            <span className="text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full bg-primary-surface text-primary">
              {badgeText}
            </span>
          )}
        </div>

        <Link
          href={seeAllHref}
          className="text-xs sm:text-sm font-medium text-primary hover:underline whitespace-nowrap"
        >
          See All →
        </Link>
      </div>

      <div className="relative">
        {/* left arrow — floating, overlapping edge, hidden below 1024px */}
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
          className="flex gap-2.5 sm:gap-3 lg:gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-1"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* right arrow — floating, overlapping edge, hidden below 1024px */}
        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-11 h-11 items-center justify-center rounded-full bg-white border border-card-border shadow-md hover:bg-primary-surface transition-colors"
        >
          <ChevronRight size={20} className="text-black" />
        </button>
      </div>
    </section>
  );
}
