// components/product-listing/MobileFilterBar.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SlidersHorizontal, ArrowUpDown, X } from "lucide-react";
import type { AvailableFilters } from "../../lib/data/buyingProduct.data";
import { FilterSidebar } from "./FilterSidebar";
import { SortSheet } from "./SortSheet";

interface Props {
  filters: AvailableFilters;
}

export function MobileFilterBar({ filters }: Props) {
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  return (
    <>
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 flex divide-x divide-gray-200">
        <button
          onClick={() => setShowFilters(true)}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-black cursor-pointer"
        >
          <SlidersHorizontal size={16} />
          Filter
        </button>
        <button
          onClick={() => setShowSort(true)}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-black cursor-pointer"
        >
          <ArrowUpDown size={16} />
          Sort By
        </button>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden fixed inset-0 z-50 bg-black/50"
            onClick={() => setShowFilters(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute inset-0 bg-white flex flex-col [&_aside]:!flex [&_aside]:!static [&_aside]:!h-full [&_aside]:!max-h-full [&_aside]:!border-none [&_aside]:!rounded-none"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center flex-end px-4 py-4 border-b border-gray-100 shrink-0">
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-hidden">
                <FilterSidebar filters={filters} />
              </div>

              <div className="p-4 border-t border-gray-100 shrink-0">
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full py-3 rounded-xl bg-primary text-white font-semibold text-sm cursor-pointer"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showSort && <SortSheet onClose={() => setShowSort(false)} />}
    </>
  );
}
