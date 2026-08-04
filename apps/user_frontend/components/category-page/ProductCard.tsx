// components/product-carousel/ProductCard.tsx
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
  variant?: "light" | "dark" | "flash";
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
  const isFlash = variant === "flash";

  return (
    <div
      className={`shrink-0 w-[220px] sm:w-[250px] lg:w-[280px] rounded-xl cursor-pointer overflow-hidden border ${
        isDark || isFlash ? "" : "bg-card-surface border-card-border"
      }`}
      style={
        isDark
          ? { backgroundColor: "#12100A", borderColor: "#674e2e55" }
          : isFlash
            ? { backgroundColor: "#121212", borderColor: "#FFFFFF1a" }
            : undefined
      }
    >
      <div
        className={`relative h-[140px] sm:h-[160px] lg:h-[180px] flex items-center justify-center ${
          isDark ? "" : isFlash ? "bg-white" : "bg-gray-200"
        }`}
        style={isDark ? { backgroundColor: "#1A1610" } : undefined}
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
            isDark || isFlash
              ? "bg-black/50 hover:bg-black/70"
              : "bg-white/90 hover:bg-white"
          }`}
        >
          <Heart
            size={13}
            style={
              isDark
                ? { color: "#d7ba86" }
                : isFlash
                  ? { color: "#1B70CD" }
                  : undefined
            }
            className={!isDark && !isFlash ? "text-gray-500" : ""}
          />
        </button>

        {image ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_CDN_URL}/${image}`}
            alt={name}
            fill
            className="object-contain p-3"
            sizes="(max-width: 640px) 220px, (max-width: 1024px) 250px, 280px"
          />
        ) : (
          <span
            className="text-xs sm:text-sm font-medium"
            style={
              isDark
                ? { color: "#d7ba8680" }
                : isFlash
                  ? { color: "#9ca3af" }
                  : { color: "#9ca3af" }
            }
          >
            {name}
          </span>
        )}
      </div>

      <div className="p-2.5 sm:p-3 flex flex-col gap-1">
        <p
          className="text-[10px] sm:text-xs"
          style={
            isDark
              ? { color: "#d7ba8699" }
              : isFlash
                ? { color: "#6b7280" }
                : { color: "#9ca3af" }
          }
        >
          {brand}
        </p>
        <p
          className={`text-xs sm:text-sm font-semibold leading-tight truncate ${
            isDark || isFlash ? "text-white" : "text-black"
          }`}
        >
          {name}
        </p>

        <div className="flex items-center gap-1.5 mt-0.5">
          <span
            className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded font-medium"
            style={
              isDark
                ? { backgroundColor: "#d7ba861a", color: "#f0cf8f" }
                : isFlash
                  ? { backgroundColor: "#1B70CD1a", color: "#1B70CD" }
                  : undefined
            }
          >
            {isDark || isFlash ? (
              storage
            ) : (
              <span className="bg-primary-surface text-primary px-0 py-0 rounded">
                {storage}
              </span>
            )}
          </span>
          <span
            className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded font-medium ${
              isDark || isFlash
                ? "bg-white/5 text-gray-400"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {condition}
          </span>
        </div>

        <div className="flex items-baseline gap-1.5 mt-1">
          <span
            className="text-sm sm:text-base font-bold"
            style={isFlash ? { color: "#1B70CD" } : undefined}
            {...(!isFlash && {
              className: `text-sm sm:text-base font-bold ${isDark ? "text-white" : "text-black"}`,
            })}
          >
            ₹{price.toLocaleString("en-IN")}
          </span>
          <span className="text-[10px] sm:text-xs text-orange-500 font-semibold">
            {discountPercent}% off
          </span>
        </div>
        <span
          className={`text-[10px] sm:text-xs line-through -mt-1 ${
            isDark || isFlash ? "text-gray-500" : "text-gray-400"
          }`}
        >
          ₹{originalPrice.toLocaleString("en-IN")}
        </span>

        <p
          className={`text-[9px] sm:text-[11px] mt-0.5 ${
            isDark || isFlash ? "text-gray-500" : "text-gray-400"
          }`}
        >
          EMI Available from ₹{emiFrom}/Month
        </p>

        <button
          type="button"
          className={`mt-2 cursor-pointer w-full text-xs sm:text-sm font-semibold py-1.5 sm:py-2 rounded-lg transition-colors ${
            isDark
              ? "text-black border"
              : isFlash
                ? "text-white"
                : "border border-primary text-primary hover:bg-primary hover:text-white"
          }`}
          style={
            isDark
              ? {
                  borderColor: "#d7ba86",
                  backgroundImage:
                    "linear-gradient(120deg, #e8dfc9 1.67%, #f0cf8f 30.32%, #d7ba86 93.87%)",
                }
              : isFlash
                ? { backgroundColor: "#0066FF" }
                : undefined
          }
        >
          View Details
        </button>
      </div>
    </div>
  );
}
