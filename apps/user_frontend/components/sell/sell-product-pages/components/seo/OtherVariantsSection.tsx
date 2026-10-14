// components/sell/sell-product-pages/components/seo/OtherVariantsSection.tsx
"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Reveal, RevealGroup, RevealItem } from "@repo/ui";

export interface VariantLinkOption {
  label: string;
  shortLabel?: string;
  href: string;
}

interface Props {
  productName: string;
  variants: VariantLinkOption[];
}

export function OtherVariantsSection({ productName, variants }: Props) {
  if (!variants.length) return null;

  return (
    <Reveal
      y={16}
      className="rounded-none md:rounded-2xl border-0 md:border md:border-gray-200 bg-none md:bg-white p-0 md:p-6"
    >
      <h2 className="text-base sm:text-lg font-bold text-gray-900">
        Other {productName} variants
      </h2>
      <p className="mt-1 text-xs sm:text-sm text-gray-500">
        Looking for a different storage size? Here are the other {productName}{" "}
        variants you can sell on HelloFi:
      </p>
      <RevealGroup
        stagger={0.05}
        className="mt-4 flex flex-wrap gap-2 sm:gap-3"
      >
        {variants.map((v) => (
          <RevealItem key={v.href} y={8}>
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
              <Link
                href={v.href}
                className="inline-block rounded-full bg-gray-100 px-3.5 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-[#0066FF] transition-colors whitespace-nowrap"
              >
                {/* Short label now shows below md (768px), not sm (640px) */}
                <span className="md:hidden">{v.shortLabel ?? v.label}</span>
                <span className="hidden md:inline">{v.label}</span>
              </Link>
            </motion.div>
          </RevealItem>
        ))}
      </RevealGroup>
    </Reveal>
  );
}
