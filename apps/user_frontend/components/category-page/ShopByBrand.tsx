// components/category-page/ShopByBrand.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { GET_IN_STOCK_BRANDS } from "../../lib/graphql/queires/brand.queries";
import { X } from "lucide-react";

interface Brand {
  id: string;
  name: string;
  seoName: string;
  image: string;
}

interface GetInStockBrandsData {
  getInStockBrands: Brand[];
}

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
            src={brand.image}
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

function AllBrandsModal({
  brands,
  onClose,
}: {
  brands: Brand[];
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-lg font-bold text-black">All Brands</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
            {brands.map((brand, i) => (
              <BrandCard
                key={brand.id}
                brand={brand}
                borderColor={
                  BORDER_COLORS[i % BORDER_COLORS.length] ??
                  DEFAULT_BORDER_COLOR
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ShopByBrand() {
  const [showModal, setShowModal] = useState(false);
  const { data, loading, error } =
    useQuery<GetInStockBrandsData>(GET_IN_STOCK_BRANDS);

  const brands: Brand[] = data?.getInStockBrands ?? [];
  const previewBrands = brands.slice(0, 6);

  if (loading) return null;
  if (error || brands.length === 0) return null;

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

      {showModal && (
        <AllBrandsModal brands={brands} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
