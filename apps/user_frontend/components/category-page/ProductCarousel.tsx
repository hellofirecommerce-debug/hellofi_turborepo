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
  variant?: "light" | "dark";
}

export function ProductCarousel({
  title,
  badgeText,
  seeAllHref = "#",
  products,
  variant = "light",
}: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDark = variant === "dark";

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
          <h2
            className={`text-base sm:text-lg lg:text-xl font-bold ${isDark ? "text-white" : "text-black"}`}
          >
            {title}
          </h2>
          {badgeText && (
            <span
              className={`text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full ${
                isDark
                  ? "bg-amber-400/10 text-amber-400"
                  : "bg-primary-surface text-primary"
              }`}
            >
              {badgeText}
            </span>
          )}
        </div>

        <Link
          href={seeAllHref}
          className={`text-xs sm:text-sm font-medium hover:underline whitespace-nowrap ${
            isDark ? "text-[#f0cf8f]" : "text-primary"
          }`}
        >
          See All →
        </Link>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className={`hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-11 h-11 items-center justify-center rounded-full shadow-md transition-colors ${
            isDark
              ? "bg-[#12100A] border border-amber-400/30 hover:bg-amber-400/10"
              : "bg-white border border-card-border hover:bg-primary-surface"
          }`}
        >
          <ChevronLeft
            size={20}
            className={isDark ? "text-amber-400" : "text-black"}
          />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-2.5 sm:gap-3 lg:gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-1"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} variant={variant} />
          ))}
        </div>

        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className={`hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-11 h-11 items-center justify-center rounded-full shadow-md transition-colors ${
            isDark
              ? "bg-[#12100A] border border-amber-400/30 hover:bg-amber-400/10"
              : "bg-white border border-card-border hover:bg-primary-surface"
          }`}
        >
          <ChevronRight
            size={20}
            className={isDark ? "text-amber-400" : "text-black"}
          />
        </button>
      </div>
    </section>
  );
}
