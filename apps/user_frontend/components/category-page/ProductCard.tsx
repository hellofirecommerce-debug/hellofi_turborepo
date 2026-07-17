import { Heart } from "lucide-react";
import Image from "next/image";

export interface Product {
  id: string;
  brand: string;
  name: string;
  image?: string;
  storage: string;
  condition: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  emiFrom: number;
  badge?: "Brand Warranty" | "Seller Warranty" | "Just In";
}

const BADGE_STYLES: Record<string, string> = {
  "Brand Warranty": "bg-primary text-white",
  "Seller Warranty": "bg-primary-light text-white",
  "Just In": "bg-success text-white",
};

interface ProductCardProps {
  product: Product;
  variant?: "light" | "dark";
}

export function ProductCard({ product, variant = "light" }: ProductCardProps) {
  const {
    brand,
    name,
    image,
    storage,
    condition,
    price,
    originalPrice,
    discountPercent,
    emiFrom,
    badge,
  } = product;

  const isDark = variant === "dark";

  return (
    <div
      className={`shrink-0 w-[220px] sm:w-[250px] lg:w-[280px] rounded-xl overflow-hidden border ${
        isDark
          ? "bg-[#12100A] border-amber-400/20"
          : "bg-card-surface border-card-border"
      }`}
    >
      <div
        className={`relative aspect-square flex items-center justify-center ${
          isDark ? "bg-[#1A1610]" : "bg-gray-200"
        }`}
      >
        {badge && (
          <span
            className={`absolute top-2 left-2 z-10 text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full ${BADGE_STYLES[badge]}`}
          >
            {badge}
          </span>
        )}
        <button
          type="button"
          aria-label="Add to wishlist"
          className={`absolute top-2 right-2 z-10 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full transition-colors ${
            isDark
              ? "bg-black/50 hover:bg-black/70"
              : "bg-white/90 hover:bg-white"
          }`}
        >
          <Heart
            size={13}
            className={isDark ? "text-amber-400/70" : "text-gray-500"}
          />
        </button>

        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 220px, (max-width: 1024px) 250px, 280px"
          />
        ) : (
          <span
            className={`text-xs sm:text-sm font-medium ${
              isDark ? "text-amber-400/50" : "text-gray-400"
            }`}
          >
            {name}
          </span>
        )}
      </div>

      <div className="p-2.5 sm:p-3 flex flex-col gap-1">
        <p
          className={`text-[10px] sm:text-xs ${isDark ? "text-amber-400/60" : "text-gray-400"}`}
        >
          {brand}
        </p>
        <p
          className={`text-xs sm:text-sm font-semibold leading-tight truncate ${
            isDark ? "text-white" : "text-black"
          }`}
        >
          {name}
        </p>

        <div className="flex items-center gap-1.5 mt-0.5">
          <span
            className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded font-medium ${
              isDark
                ? "bg-amber-400/10 text-amber-400"
                : "bg-primary-surface text-primary"
            }`}
          >
            {storage}
          </span>
          <span
            className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded font-medium ${
              isDark ? "bg-white/5 text-gray-400" : "bg-gray-100 text-gray-500"
            }`}
          >
            {condition}
          </span>
        </div>

        <div className="flex items-baseline gap-1.5 mt-1">
          <span
            className={`text-sm sm:text-base font-bold ${isDark ? "text-white" : "text-black"}`}
          >
            ₹{price.toLocaleString("en-IN")}
          </span>
          <span className="text-[10px] sm:text-xs text-orange-500 font-semibold">
            {discountPercent}% off
          </span>
        </div>
        <span
          className={`text-[10px] sm:text-xs line-through -mt-1 ${
            isDark ? "text-gray-500" : "text-gray-400"
          }`}
        >
          ₹{originalPrice.toLocaleString("en-IN")}
        </span>

        <p
          className={`text-[9px] sm:text-[11px] mt-0.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}
        >
          EMI Available from ₹{emiFrom}/Month
        </p>

        <button
          type="button"
          className={`mt-2 w-full text-xs sm:text-sm font-semibold py-1.5 sm:py-2 rounded-lg border transition-colors ${
            isDark
              ? "border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black"
              : "border-primary text-primary hover:bg-primary hover:text-white"
          }`}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
