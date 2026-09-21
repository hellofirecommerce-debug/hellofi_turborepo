// components/sell-category-page/SellTopModels.tsx
"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TopModel {
  id: string;
  name: string;
  variant: string;
  price: string;
  badge?: string;
}

const TOP_MODELS: TopModel[] = [
  {
    id: "1",
    name: "Apple iPhone 13",
    variant: "256GB · Space Black",
    price: "72,000",
  },
  {
    id: "2",
    name: "Apple iPhone 15",
    variant: "128GB · Deep Purple",
    price: "56,000",
  },
  {
    id: "3",
    name: "Apple iPhone 15 Pro Max",
    variant: "128GB · Midnight",
    price: "44,000",
  },
  {
    id: "4",
    name: "Apple iPhone 16",
    variant: "256GB · Titanium",
    price: "68,000",
    badge: "Top Price",
  },
  {
    id: "5",
    name: "Apple iPhone 17 Pro Max",
    variant: "256GB · Flowy Emerald",
    price: "36,000",
  },
  {
    id: "6",
    name: "Samsung Galaxy S24 Ultra",
    variant: "128GB · Obsidian",
    price: "34,000",
  },
  {
    id: "7",
    name: "Samsung Galaxy S23",
    variant: "128GB · Cream",
    price: "28,000",
  },
  {
    id: "8",
    name: "OnePlus 12",
    variant: "256GB · Flowy Emerald",
    price: "26,000",
  },
  {
    id: "9",
    name: "Google Pixel 8 Pro",
    variant: "128GB · Obsidian",
    price: "32,000",
  },
  {
    id: "10",
    name: "Xiaomi 14 Ultra",
    variant: "256GB · Black",
    price: "30,000",
  },
];

export function SellTopModels() {
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
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
          Top Selling Models
        </h2>

        <div className="relative">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
            className="hidden cursor-pointer lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 w-11 h-11 items-center justify-center rounded-full shadow-md bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={20} className="text-black" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {TOP_MODELS.map((model) => (
              <div
                key={model.id}
                className="shrink-0 w-[160px] sm:w-[180px] rounded-xl border border-gray-200 p-3"
              >
                <div className="relative h-24 sm:h-28 rounded-lg bg-gray-100 flex items-center justify-center">
                  {model.badge && (
                    <span className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#0066FF] text-white">
                      {model.badge}
                    </span>
                  )}
                  <span className="text-xs text-gray-400">No image</span>
                </div>

                <p className="mt-3 text-sm font-semibold text-gray-900 leading-tight">
                  {model.name}
                </p>
                <p className="mt-1 text-xs text-gray-500">{model.variant}</p>

                <p className="mt-2 text-[10px] font-semibold text-gray-500 uppercase">
                  Up To
                </p>
                <p className="text-base font-extrabold text-gray-900">
                  ₹{model.price}
                </p>

                <button className="mt-2 text-xs font-semibold text-[#0066FF] hover:underline">
                  Check Exact Price →
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
            className="hidden cursor-pointer lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-11 h-11 items-center justify-center rounded-full shadow-md bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <ChevronRight size={20} className="text-black" />
          </button>
        </div>
      </div>
    </section>
  );
}
