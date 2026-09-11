// components/product-listing/SortSheet.tsx
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

export function SortSheet({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeSort = searchParams.get("sort") ?? "newest";

  const selectSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`);
    onClose();
  };

  return (
    <div
      className="sm:hidden fixed inset-0 z-50 bg-black/50 flex items-end"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-2xl w-full p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-sm font-bold text-black mb-3">Sort By</p>
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => selectSort(opt.value)}
            className={`w-full text-left py-2.5 text-sm ${
              activeSort === opt.value
                ? "text-primary font-semibold"
                : "text-gray-700"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}