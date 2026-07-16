import { Heart } from "lucide-react";

export interface Product {
  id: string;
  brand: string;
  name: string;
  image?: string; // optional now — falls back to placeholder box
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

export function ProductCard({ product }: { product: Product }) {
  const {
    brand,
    name,
    storage,
    condition,
    price,
    originalPrice,
    discountPercent,
    emiFrom,
    badge,
  } = product;

  return (
    <div className="shrink-0 w-[220px] sm:w-[250px] lg:w-[280px] bg-card-surface border border-card-border rounded-xl overflow-hidden">
      <div className="relative aspect-square bg-gray-200 flex items-center justify-center">
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
          className="absolute top-2 right-2 z-10 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full bg-white/90 hover:bg-white transition-colors"
        >
          <Heart size={13} className="text-gray-500" />
        </button>
        <span className="text-xs sm:text-sm font-medium text-gray-400">
          {name}
        </span>
      </div>

      <div className="p-2.5 sm:p-3 flex flex-col gap-1">
        <p className="text-[10px] sm:text-xs text-gray-400">{brand}</p>
        <p className="text-xs sm:text-sm font-semibold text-black leading-tight truncate">
          {name}
        </p>

        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded bg-primary-surface text-primary font-medium">
            {storage}
          </span>
          <span className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-medium">
            {condition}
          </span>
        </div>

        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="text-sm sm:text-base font-bold text-black">
            ₹{price.toLocaleString("en-IN")}
          </span>
          <span className="text-[10px] sm:text-xs text-orange-500 font-semibold">
            {discountPercent}% off
          </span>
        </div>
        <span className="text-[10px] sm:text-xs text-gray-400 line-through -mt-1">
          ₹{originalPrice.toLocaleString("en-IN")}
        </span>

        <p className="text-[9px] sm:text-[11px] text-gray-400 mt-0.5">
          EMI Available from ₹{emiFrom}/Month
        </p>

        <button
          type="button"
          className="mt-2 w-full border border-primary text-primary text-xs sm:text-sm font-semibold py-1.5 sm:py-2 rounded-lg hover:bg-primary hover:text-white transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
