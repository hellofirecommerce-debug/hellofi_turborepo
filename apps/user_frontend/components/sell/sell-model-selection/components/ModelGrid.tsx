"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MotionCard, Skeleton } from "@repo/ui";
import {
  getSellingProductsByBrand,
  type SellingProduct,
} from "../../../../lib/data/sellingProduct.data";

interface Props {
  brandSlug: string;
  categorySlug: string;
  initialItems: SellingProduct[];
  initialHasMore: boolean;
  activeSeriesId: string | null;
}

const GRID = "grid grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4";

export function ModelGrid({
  brandSlug,
  categorySlug,
  initialItems,
  initialHasMore,
  activeSeriesId,
}: Props) {
  const [items, setItems] = useState<SellingProduct[]>(initialItems);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (isFetchingRef.current || !hasMore) return;
    isFetchingRef.current = true;
    setLoading(true);
    try {
      const page = await getSellingProductsByBrand(
        brandSlug,
        categorySlug,
        items.length,
        10,
      );
      setItems((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        return [...prev, ...page.items.filter((p) => !existingIds.has(p.id))];
      });
      setHasMore(page.hasMore);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [brandSlug, categorySlug, items.length, hasMore]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "400px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  let filtered = query
    ? items.filter((p) =>
        p.productName.toLowerCase().includes(query.toLowerCase()),
      )
    : items;

  if (activeSeriesId) {
    filtered = filtered.filter((p) => p.series.id === activeSeriesId);
  }

  const sectionMap = new Map<
    string,
    {
      id: string;
      seriesName: string;
      priority: number;
      products: SellingProduct[];
    }
  >();

  for (const product of filtered) {
    const key = product.series.id;
    const existing = sectionMap.get(key);
    if (existing) {
      existing.products.push(product);
    } else {
      sectionMap.set(key, {
        id: key,
        seriesName: product.series.seriesName,
        priority: product.series.priority,
        products: [product],
      });
    }
  }

  const sections = Array.from(sectionMap.values()).sort(
    (a, b) => a.priority - b.priority,
  );

  return (
    <div className="w-full">
      {/* Search */}
      <div className="relative mb-6 group">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none transition-colors group-focus-within:text-[#0066FF]"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search iPhone model..."
          className="w-full h-12 pl-10 pr-10 rounded-xl border border-gray-300 bg-white text-sm text-gray-800 shadow-sm transition-all duration-200 focus:outline-none focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10"
        />
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              <X size={14} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      <AnimatePresence>
        {sections.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center py-16"
          >
            <p className="text-sm font-semibold text-gray-800">
              No models found
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Try a different name or clear the filter.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sections */}
      <AnimatePresence mode="popLayout">
        {sections.map((section) => (
          <motion.div
            key={section.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-8"
          >
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-3"
            >
              <span className="h-4 w-1 rounded-full bg-[#0066FF]" />
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                {section.seriesName}
              </p>
              <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
                {section.products.length}
              </span>
            </motion.div>

            <div className={GRID}>
              <AnimatePresence mode="popLayout">
                {section.products.map((product, i) => (
                  <MotionCard key={product.id} delay={(i % 10) * 0.04}>
                    <Link
                      href={`/sell-old-${categorySlug}/${brandSlug}/${product.productSeoName}`}
                      className="group block rounded-2xl border border-gray-200 bg-white p-2 sm:p-3 text-left cursor-pointer transition-[border-color,box-shadow] duration-300 hover:border-[#0066FF] hover:shadow-lg hover:shadow-[#0066FF]/10"
                    >
                      <div className="relative w-full aspect-square rounded-xl bg-gray-50 overflow-hidden">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_CDN_URL}/${product.image}`}
                          alt={product.productName}
                          fill
                          className="object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-110"
                          sizes="(max-width: 768px) 33vw, 180px"
                        />
                      </div>
                      <p className="mt-2 text-[11px] sm:text-sm font-medium text-gray-800 text-center leading-snug transition-colors group-hover:text-[#0066FF]">
                        {product.productName}
                      </p>
                    </Link>
                  </MotionCard>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <div ref={sentinelRef} className="h-4" />

      {/* Loading skeletons */}
      {loading && (
        <div className={`${GRID} pb-4`}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-100 bg-white p-2 sm:p-3"
            >
              <Skeleton className="w-full aspect-square rounded-xl" />
              <Skeleton className="h-3 w-3/4 mx-auto rounded mt-3" />
            </div>
          ))}
        </div>
      )}

      {!hasMore && items.length > 0 && (
        <p className="text-center text-xs text-gray-400 py-4">No more models</p>
      )}
    </div>
  );
}
