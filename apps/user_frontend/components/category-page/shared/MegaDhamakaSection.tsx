// components/category-page/shared/MegaDhamakaSection.tsx
"use client";

import { useEffect, useState } from "react";
import { ProductCard, type Product } from "../ProductCard";

interface MegaDhamakaSectionProps {
  products: Product[];
  endsAt: string; // ISO datetime string
  totalUnits: number;
  unitsRemaining: number;
}

function getTimeLeft(endsAt: string) {
  const diff = Math.max(0, new Date(endsAt).getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    mins: Math.floor((diff / (1000 * 60)) % 60),
    secs: Math.floor((diff / 1000) % 60),
  };
}

export function MegaDhamakaSection({
  products,
  endsAt,
  totalUnits,
  unitsRemaining,
}: MegaDhamakaSectionProps) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(endsAt));

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft(endsAt)), 1000);
    return () => clearInterval(interval);
  }, [endsAt]);

  const percentRemaining = Math.max(
    0,
    Math.min(100, (unitsRemaining / totalUnits) * 100),
  );

  const timeUnits = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.mins, label: "Mins" },
    { value: timeLeft.secs, label: "Secs" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 w-full">
      <div
        className="rounded-2xl border p-4 sm:p-6"
        style={{ backgroundColor: "#0A0A0A", borderColor: "#1B70CD5c" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] gap-5 lg:gap-8 lg:items-center">
          {/* left — sale info + countdown, vertically centered on desktop */}
          <div>
            <span className="inline-block bg-white text-black text-[9px] sm:text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full mb-2.5 sm:mb-3">
              Flash Live Sale
            </span>

            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-4 sm:mb-5 tracking-tight"
              style={{
                color: "#3B82F6",
                textShadow: "0 0 20px #1B70CD66",
              }}
            >
              MEGA DHAMAKA
            </h2>

            <p className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2 sm:mb-2.5">
              Stocks Depleting In
            </p>

            <div className="flex gap-2 sm:gap-3 mb-5 sm:mb-6">
              {timeUnits.map(({ value, label }, i) => {
                const isLast = i === timeUnits.length - 1;
                return (
                  <div
                    key={label}
                    className="flex flex-col items-center rounded-lg px-2.5 py-2 sm:px-3.5 sm:py-2.5 min-w-[48px] sm:min-w-[60px] border"
                    style={
                      isLast
                        ? { backgroundColor: "#1B70CD", borderColor: "#1B70CD" }
                        : { backgroundColor: "#0A0A0A", borderColor: "#1B70CD" }
                    }
                  >
                    <span className="text-base sm:text-xl font-bold text-white tabular-nums">
                      {String(value).padStart(2, "0")}
                    </span>
                    <span
                      className="text-[8px] sm:text-[9px] uppercase mt-0.5"
                      style={{ color: isLast ? "#c7ddfb" : "#6b7280" }}
                    >
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
              Units Remaining
            </p>
            <div className="flex items-center justify-between mb-1.5">
              <div
                className="flex-1 h-1.5 rounded-full overflow-hidden mr-2"
                style={{ backgroundColor: "#FFFFFF1a" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${percentRemaining}%`,
                    backgroundColor: "#1B70CD",
                  }}
                />
              </div>
              <span
                className="text-xs sm:text-sm font-bold shrink-0"
                style={{ color: "#1B70CD" }}
              >
                {unitsRemaining}/{totalUnits}
              </span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-gray-500">
              Only {unitsRemaining} Remaining — Hurry!
            </p>
          </div>

          {/* right — reuse ProductCard, flash variant */}
          <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide lg:items-center">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} variant="flash" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
