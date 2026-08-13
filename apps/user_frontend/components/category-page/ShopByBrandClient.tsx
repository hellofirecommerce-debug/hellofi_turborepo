// components/category-page/ShopByBrandClient.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import type { Brand } from "../../lib/data/brand.data";
import { AllBrandsModal } from "./modals/AllBrandsModal";

const BORDER_COLORS = [
  "border-orange-400",
  "border-blue-400",
  "border-emerald-400",
  "border-amber-400",
  "border-rose-400",
  "border-sky-400",
  "border-violet-400",
  "border-teal-400",
];

const DEFAULT_BORDER_COLOR = "border-gray-300";

function BrandCard({
  brand,
  borderColor,
}: {
  brand: Brand;
  borderColor: string;
}) {
  return (
    <Link
      href={`/buy-used-gadgets?brand=${brand.seoName}`}
      className={`flex items-center gap-2.5 sm:gap-3 rounded-xl border-2 ${borderColor} bg-white px-3 py-3 sm:px-3.5 sm:py-3.5 hover:-translate-y-0.5 transition-transform`}
    >
      <div className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
        {brand.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`${process.env.NEXT_PUBLIC_CDN_URL}/${brand.image}`}
            alt={brand.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <span className="text-xs sm:text-sm font-bold text-gray-400">
            {brand.name.charAt(0)}
          </span>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-xs sm:text-sm font-bold text-black leading-tight truncate">
          {brand.name}
        </p>
      </div>
    </Link>
  );
}

export function ShopByBrandClient({ brands }: { brands: Brand[] }) {
  const [showModal, setShowModal] = useState(false);
  const previewBrands = brands.slice(0, 6);

  return (
    <div>
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-black">
            Shop by Brand
          </h2>
          <span className="text-[10px] sm:text-xs font-medium px-2.5 py-1 rounded-full bg-primary-surface text-primary">
            Top Brands
          </span>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="text-xs sm:text-sm font-medium text-primary hover:underline whitespace-nowrap"
        >
          Browse All →
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 lg:gap-4">
        {previewBrands.map((brand, i) => (
          <BrandCard
            key={brand.id}
            brand={brand}
            borderColor={
              BORDER_COLORS[i % BORDER_COLORS.length] ?? DEFAULT_BORDER_COLOR
            }
          />
        ))}
      </div>

      <AllBrandsModal
        brands={brands}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
