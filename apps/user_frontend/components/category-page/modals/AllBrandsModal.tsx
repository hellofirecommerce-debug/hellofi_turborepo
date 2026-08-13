// components/category-page/AllBrandsModal.tsx
"use client";

import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "motion/react";
import { X } from "lucide-react";
import type { Brand } from "../../../lib/data/brand.data";

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

const gridVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

function BrandCard({
  brand,
  borderColor,
}: {
  brand: Brand;
  borderColor: string;
}) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
    >
      <Link
        href={`/buy-used-gadgets?brand=${brand.seoName}`}
        className={`flex items-center gap-2.5 sm:gap-3 rounded-xl border-2 ${borderColor} bg-white px-3 py-3 sm:px-3.5 sm:py-3.5 transition-colors`}
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
    </motion.div>
  );
}

interface AllBrandsModalProps {
  brands: Brand[];
  isOpen: boolean;
  onClose: () => void;
}

export function AllBrandsModal({
  brands,
  isOpen,
  onClose,
}: AllBrandsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h3 className="text-lg font-bold text-black">All Brands</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-black transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-4">
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3"
                variants={gridVariants}
                initial="hidden"
                animate="show"
              >
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
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
