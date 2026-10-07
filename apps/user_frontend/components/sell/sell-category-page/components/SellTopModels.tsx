// components/sell-category-page/SellTopModels.tsx
"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Smartphone } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";

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
    const amount = container.clientWidth * 0.9;
    container.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                Top Selling Models
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Tap a model to check your exact price.
              </p>
            </div>

            {/* Arrows live in the header so they never cover a card */}
            <div className="hidden sm:flex gap-2">
              <button
                type="button"
                onClick={() => scroll("left")}
                aria-label="Scroll left"
                className="group flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white shadow-md ring-1 ring-sky-100 transition-all duration-300 hover:scale-110 hover:bg-[#0066FF]"
              >
                <ChevronLeft
                  size={20}
                  className="text-gray-800 transition-colors group-hover:text-white"
                />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                aria-label="Scroll right"
                className="group flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white shadow-md ring-1 ring-sky-100 transition-all duration-300 hover:scale-110 hover:bg-[#0066FF]"
              >
                <ChevronRight
                  size={20}
                  className="text-gray-800 transition-colors group-hover:text-white"
                />
              </button>
            </div>
          </div>
        </Reveal>

        <div
          ref={scrollRef}
          className="mt-6 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {/* Card width is a share of the row, so exactly N cards fit:
              mobile 2 · tablet 3 · desktop 5 (gap 32px = 4 gaps = 8rem) */}
          <RevealGroup
            stagger={0.07}
            className="flex gap-4 px-1 py-4 sm:gap-6 lg:gap-8"
          >
            {TOP_MODELS.map((model) => (
              <RevealItem
                key={model.id}
                className="shrink-0 basis-[calc((100%-1rem)/2)] sm:basis-[calc((100%-3rem)/3)] lg:basis-[calc((100%-8rem)/5)]"
              >
                <div className="group h-full rounded-2xl border border-sky-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-sky-500/15">
                  <div className="relative flex h-28 items-center justify-center rounded-xl bg-gradient-to-br from-[#EEF3FF] via-[#F0F9FF] to-[#E0F2FE] sm:h-36">
                    {model.badge && (
                      <span className="absolute left-2 top-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                        {model.badge}
                      </span>
                    )}
                    <Smartphone
                      size={40}
                      className="text-[#38BDF8]/60 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"
                    />
                  </div>

                  <p className="mt-4 text-sm font-semibold leading-tight text-gray-900">
                    {model.name}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">{model.variant}</p>

                  <p className="mt-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                    Up To
                  </p>
                  <p className="text-lg font-extrabold text-gray-900">
                    ₹{model.price}
                  </p>

                  <button
                    type="button"
                    className="mt-3 w-full cursor-pointer rounded-xl bg-[#0066FF]/10 py-2 text-xs font-semibold text-[#0066FF] transition-colors duration-300 hover:bg-[#0066FF] hover:text-white"
                  >
                    Check Exact Price →
                  </button>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
